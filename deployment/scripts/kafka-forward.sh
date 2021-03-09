#!/bin/bash

# This is a bit hardcoded, but it's meant as a proof of concept.

# used in microk8s kubectl get pods when targeting kafka broker pods
KARGS="-n kafka -l app.kubernetes.io/component=kafka"
# used in microk8s kubectl port-forward (setting the namespace, can be omitted)
KPORTFWD_ARGS="-n kafka"
# port on broker pods to forward
DPORT=9092

RELEASE_NAME="my-kafka"

function getPods {
  microk8s kubectl get pods $KARGS -o go-template --template="{{range .items}}{{.metadata.name}}:{{.status.podIP}} {{end}}"
}

function execute {
  sed -i /$RELEASE_NAME/d /etc/hosts
  LAST='127.0.0.1'
  for line in $(getPods); do
    IFS=: read POD IP <<<$line
    LAST=$IP
    echo "$IP $POD.my-kafka-headless.kafka.svc.cluster.local" >> /etc/hosts
  done
  echo "$LAST my-kafka" >> /etc/hosts

  echo "Content of the hosts file:"
  printf '%b\n' "$(cat /etc/hosts)"
}


execute
