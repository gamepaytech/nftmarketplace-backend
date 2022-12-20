# https://hub.docker.com/_/node
FROM node:18-slim

LABEL maintainer="hello@gamepay.sg"



# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
# RUN npm ci --only=production
RUN npm install --only=production

# Copy local code to the container image.
COPY . ./


EXPOSE 5000

CMD ["npm", "start"]

# docker build -t nftmarketplace-backend .
# docker run -p3000:3000 nftmarketplace-backend