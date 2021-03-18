#!/bin/bash

### Requirement: apt install libnss3-tools

file="domains.ext"
domain="nwsd.tk"

rm -rf out
mkdir out

# First, create a file domains.ext that lists all your local domains:
echo "authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = $domain
DNS.2 = www.$domain
DNS.3 = auth.$domain" > out/$file

#Certificate authority (CA)
openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 -keyout out/RootCA.key -out out/RootCA.pem -subj "/C=US/CN=Example-Root-CA"
openssl x509 -outform pem -in out/RootCA.pem -out out/RootCA.crt

#Generate localhost.key, localhost.csr, and localhost.crt:
openssl req -new -nodes -newkey rsa:2048 -keyout out/localhost.key -out out/localhost.csr -subj "/C=US/ST=YourState/L=YourCity/O=Example-Certificates/CN=$domain"
openssl x509 -req -sha256 -days 1024 -in out/localhost.csr -CA out/RootCA.pem -CAkey out/RootCA.key -CAcreateserial -extfile out/domains.ext -out out/localhost.crt

# Add cetrs to the linux local registry
sudo cp out/RootCA.pem /usr/local/share/ca-certificates/RootCA.crt
sudo update-ca-certificates

certfile="out/RootCA.pem"
certname="My Root CA"

# Add certs to the browsers DBs registries
for certDB in $(find ~/ -name "cert9.db")
do
    certdir=$(dirname ${certDB});
    certutil -A -n "${certname}" -t "TCu,Cu,Tu" -i ${certfile} -d sql:${certdir}
done

# Clear and add kubernetes TLS secret for the localhost 
microk8s kubectl delete secret tls localhost-cert 
microk8s kubectl create secret tls localhost-cert --key out/localhost.key --cert out/localhost.crt