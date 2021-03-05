helm delete my-mongo
helm delete my-redis
kubectl delete -f 01-chat-service.yaml
kubectl delete -f 02-chat-app.yaml
kubectl delete -f 03-user-service.yaml