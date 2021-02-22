FROM node:12

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

EXPOSE 8080

# run CMD command "yarn start:prod"
CMD [ "node", "dist/main.js" ]
