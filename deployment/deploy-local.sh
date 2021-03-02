microk8s helm install my-mongo bitnami/mongodb
microk8s helm install my-redis --set cluster.slaveCount=0 bitnami/redis
microk8s kubectl apply -f 01-user-service.yaml
microk8s kubectl apply -f 02-chat-service.yaml
microk8s kubectl apply -f 03-chat-app.yaml