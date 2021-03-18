#!/bin/bash

# Generate TLS cert
sh ./scripts/keygen.sh

# Create namespace for kafka
microk8s kubectl create ns kafka

# Setup helm to be able to use bitnami charts
microk8s helm repo add bitnami https://charts.bitnami.com/bitnami

#Basic mongo
microk8s helm install my-mongo bitnami/mongodb

# Redis with 0 slaves to save resources
microk8s helm install my-redis --set cluster.slaveCount=0 bitnami/redis

#Kafka
microk8s helm install my-kafka --namespace kafka -f 07-kafka-config.yaml bitnami/kafka

# Chat + Users API + Client
microk8s kubectl apply -f 01-user-service.yaml
microk8s kubectl apply -f 02-chat-service.yaml
microk8s kubectl apply -f 03-chat-app.yaml

# Traefik
microk8s kubectl apply -f 04-traefik-rbac.yaml
microk8s kubectl apply -f 05-traefik-deployment.yaml
microk8s kubectl apply -f 06-traefik-ingress-routes.yaml

# Facebook oauth servcie
microk8s kubectl apply -f 08-auth-middleware.yaml
