# nftmarketplace-backend

npm install

npm start

##Dependencies
Refer .env.sample for the local setup

# migrate-mongo steps

npm i migrate-mongo
migrate-mongo init
migrate-mongo create name-of-migration-script
migrate-mongo up


## Running using Docker

docker build . -t gamepay/nftmarketplace-backend 

docker run -p 5000:5000 gamepay/nftmarketplace-backend

### Test deployment 

http://localhost:5000/gamepay-listing/all-games
