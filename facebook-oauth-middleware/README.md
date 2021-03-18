# oauth_traefik_middleware
This middleware allows to secure Traefik IngressRoutes with a Facebook SSO


### Kubernetes + Traefik config example

```
kind: Deployment
apiVersion: apps/v1
metadata:
  namespace: default
  name: auth-middleware
  labels:
    app: auth-middleware

spec:
  replicas: 1
  selector:
    matchLabels:
      app: auth-middleware
  template:
    metadata:
      labels:
        app: auth-middleware
    spec:
      containers:
        - name: auth-middleware
          image: localhost:32000/node-auth-middleware
          env:
            - name: COOKIE_DOMAIN
              value: "nwsd.tk"
            - name: APP_URL
              value: "https://nwsd.tk"
            - name: MIDDLEWARE_URL
              value: "https://auth.nwsd.tk"
            - name: CLIENT_ID
              value: "XXX" 
            - name: CLIENT_SECRET
              value: "XXX"        
          ports:
            - name: web
              containerPort: 8125

---
apiVersion: v1
kind: Service
metadata:
  name: auth-middleware

spec:
  ports:
    - protocol: TCP
      name: web
      port: 8125
  selector:
    app: auth-middleware

---
apiVersion: traefik.containo.us/v1alpha1
kind: Middleware
metadata:
  name: sso
spec:
  forwardAuth:
    address: http://auth-middleware:8125
    authResponseHeaders: 
        - "X-Forwarded-User"
    trustForwardHeader: true
---
apiVersion: v1
kind: Service
metadata:
  name: whoami

spec:
  ports:
    - protocol: TCP
      name: web
      port: 80
  selector:
    app: whoami
---
kind: Deployment
apiVersion: apps/v1
metadata:
  namespace: default
  name: whoami
  labels:
    app: whoami

spec:
  replicas: 1
  selector:
    matchLabels:
      app: whoami
  template:
    metadata:
      labels:
        app: whoami
    spec:
      containers:
        - name: whoami
          image: containous/whoami
          ports:
            - name: web
              containerPort: 80
---
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: ingressroutetls
  namespace: default
spec:
  entryPoints:
    - websecure
  routes:
  - match: Host(`nwsd.tk`)
    kind: Rule
    services:
    - name: whoami
      port: 80
    middlewares:
    - name: default-sso@kubernetescrd
  tls:
    certResolver: myresolver
---
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: traefik-sso
spec:
  entryPoints:
    - websecure
  routes:
  - match: Host(`auth.nwsd.tk`)
    kind: Rule
    services:
    - name: auth-middleware
      port: 8125
  tls:
    certResolver: myresolver
```