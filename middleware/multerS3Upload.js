const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

aws.config.update({
    secretAccessKey: process.env.LOG_S3_SECRET_ACCESS_KEY,
    accessKeyId: process.env.LOG_S3_ACCESS_KEY,
    region: process.env.PINATA_S3_REGION,
})


const s3 = new aws.S3()

 const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.PINATA_S3_BUCCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

module.exports = upload