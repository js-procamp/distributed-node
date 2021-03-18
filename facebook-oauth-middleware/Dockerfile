FROM mhart/alpine-node:12

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 8125
CMD [ "node", "index.js" ]