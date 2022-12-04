FROM node:16-alpine


LABEL maintainer="hello@gamepay.sg"

WORKDIR /app
COPY . .
RUN npm install

EXPOSE 5000

CMD ["npm", "start"]