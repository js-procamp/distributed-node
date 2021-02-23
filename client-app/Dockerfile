# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM mhart/alpine-node:14 as build-stage

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json 
# AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN yarn

# Bundle app source
COPY . .

# Build the app
RUN yarn build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.19-alpine as base-stage

COPY nginx-default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]