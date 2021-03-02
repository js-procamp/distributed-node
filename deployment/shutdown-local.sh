microk8s helm delete my-mongo
microk8s helm delete my-redis
microk8s kubectl delete -f 01-user-service.yaml
microk8s kubectl delete -f 02-chat-service.yaml
microk8s kubectl delete -f 03-chat-app.yaml