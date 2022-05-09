require('dotenv').config();
const winston = require('winston');
const { combine, timestamp, json } = winston.format;
const S3StreamLogger = require('s3-streamlogger').S3StreamLogger;
const os = require('os');

const transporters = [];

if(process.env.LOG_S3_ENABLED === 'true') {
  const s3stream = new S3StreamLogger({
    bucket: process.env.LOG_S3_BUCKET_NAME,
    folder: process.env.LOG_S3_FOLDER_NAME,
    tags: { project: 'nft-market-place-backend' },
    access_key_id: process.env.LOG_S3_ACCESS_KEY,
    secret_access_key: process.env.LOG_S3_SECRET_ACCESS_KEY,
    name_format: '%Y-%m-%d-'+ process.env.NODE_ENV +'-nftmarketplace-backend.log'
  });
  const s3transport = new winston.transports.Stream({
    stream: s3stream
  });
  s3transport.on('error', function (err) {
    console.log("An error occured during transfer of logs to S3");
    console.log(err);
  });
  transporters.push(s3transport);
} else {
  transporters.push(new winston.transports.File({
    filename: 'nftmarketplace-backend.log',
  }));
  transporters.push(new winston.transports.File({
    filename: 'nftmarketplace-backend-error.log',
    level: 'error',
    format: combine(timestamp(), json()),
  }));
  transporters.push(new winston.transports.File({
    filename: 'nftmarketplace-backend-info.log',
    level: 'info',
    format: combine(timestamp(), json()),
  }));
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), json()),
  defaultMeta: {
    hostName: os.hostname(),
    service: 'nftmarketplace-backend',
  },
  transports: transporters
});

module.exports = logger;