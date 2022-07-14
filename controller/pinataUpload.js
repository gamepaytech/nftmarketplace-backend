const pinataSDK = require("@pinata/sdk");
const logger = require('../logger')
const {GetObjectCommand, S3Client} = require('@aws-sdk/client-s3')

const s3Client = new S3Client({
  apiVersion: '2006-03-01',
  region: process.env.PINATA_S3_REGION,
  credentials: {
      accessKeyId: process.env.LOG_S3_ACCESS_KEY,
      secretAccessKey: process.env.LOG_S3_SECRET_ACCESS_KEY,
  }
})


const uploadToPinata = async (req, res) => {
  try {
  const pinata = pinataSDK(
    process.env.PINATA_API_KEY,
    process.env.PINATA_SECRET_API_KEY
  );

  const data = req.body;
  const file = req.file;

    const fileObject = await s3Client
    .send(new GetObjectCommand({
      Bucket: process.env.PINATA_S3_BUCCKET_NAME,
      Key: file.key
    }))

    const readableStreamForFile = fileObject.Body

    const options = {
      pinataMetadata: {
        name: `${data.name}.img`,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };
    let result;
    try {
      result = await pinata.pinFileToIPFS(readableStreamForFile, options);
    } catch (e) {
      logger.error(e,"error pin file to ipfs")
      return res.status(500).send(e);
    }
    data.image = process.env.PINATA_GATEWAY + result.IpfsHash;
    data.attributes = JSON.parse(data.attributes)

    try {
      result = await pinata.pinJSONToIPFS(data, options);
    } catch (e) {
      logger.error(e,"error pin json to ipfs")
      return res.status(500).send(e);
    }
    res.status(200).send(process.env.PINATA_GATEWAY + result.IpfsHash);
  } catch (err) {
    logger.error(err,"error")
    return res.status(500).send(err);
  }

};


const uploadJSONToPinata = async (data) => {
  const pinata = pinataSDK(
    process.env.PINATA_API_KEY,
    process.env.PINATA_SECRET_API_KEY
  );
  let result;
    try {
      result = await pinata.pinJSONToIPFS(data, {});
    } catch (e) {
      console.log(e);
    }
    return process.env.PINATA_GATEWAY + result.IpfsHash;
}
module.exports = { uploadToPinata,uploadJSONToPinata };