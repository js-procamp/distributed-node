microk8s helm delete my-mongo
microk8s helm delete my-redis
#microk8s helm delete my-kafka
microk8s kubectl delete -f 01-user-service.yaml
microk8s kubectl delete -f 02-chat-service.yaml
microk8s kubectl delete -f 03-chat-app.yaml
#microk8s kubectl delete -f 04-traefik-rbac.yaml
#microk8s kubectl delete -f 05-traefik-deployment.yaml
#microk8s kubectl delete -f 06-traefik-ingress-routes.yaml