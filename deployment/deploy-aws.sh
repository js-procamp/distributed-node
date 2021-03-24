#!/bin/bash

# Create a cluster in AWS
eksctl create cluster -f 00-aws-cluster.yaml

# Create namespace for kafka
 kubectl create ns kafka

# Setup helm to be able to use bitnami charts
 helm repo add bitnami https://charts.bitnami.com/bitnami

#Basic mongo
 helm install my-mongo bitnami/mongodb

# Redis with 0 slaves to save resources
 helm install my-redis --set cluster.slaveCount=0 bitnami/redis

#Kafka
 helm install my-kafka --namespace kafka -f 07-kafka-config.yaml bitnami/kafka

# Chat + Users API + Client
 kubectl apply -f 01-user-service.yaml
 kubectl apply -f 02-chat-service.yaml
 kubectl apply -f 03-chat-app.yaml

# Traefik
 kubectl apply -f 04-traefik-rbac.yaml
 kubectl apply -f 05-traefik-deployment.yaml
 kubectl apply -f 06-traefik-ingress-routes.yaml

# Facebook oauth servcie
 kubectl apply -f 08-auth-middleware.yaml
