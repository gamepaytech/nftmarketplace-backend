require('dotenv').config();
const winston = require('winston');
const { combine, timestamp,json } = winston.format;
const S3StreamLogger = require('s3-streamlogger').S3StreamLogger;

const s3stream = new S3StreamLogger({
    bucket:  process.env.S3_BUCKET_NAME,                
    folder:  process.env.S3_FOLDER_NAME,        
    tags: { project: 'nft-market-place-backend'},
    access_key_id: process.env.S3_ACCESS_KEY,
    secret_access_key: process.env.S3_SECRET_ACCESS_KEY
});

const s3transport = new winston.transports.Stream({
    stream: s3stream
});

s3transport.on('error', function(err){
    logger.error("An error occured during s3 transport of logs");
    logger.error(err);
}); 

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), json()),
    defaultMeta: {
        hostName: 'nft-market-place-backend-code',
        service: 'nft-backend-service',
      },
    transports: [
        // new winston.transports.File({
        //   filename: 'combined-2.log',
        // }),
        // new winston.transports.File({
        //   filename: 'app-error-2.log',
        //   level: 'error',
        //   format: combine(timestamp(), json()),
        // }),
        // new winston.transports.File({
        //   filename: 'app-info-2.log',
        //   level: 'info',
        //   format: combine(timestamp(), json()),
        // }),
        s3transport
      ],
  });

  module.exports = logger;