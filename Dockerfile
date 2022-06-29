FROM node:16-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN apk --no-cache add git
RUN npm install
EXPOSE 5000
CMD [ "node", "server.js" ]
