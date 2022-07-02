const pinataSDK = require("@pinata/sdk");
const multer = require("multer");
const fs = require("fs");
const logger = require('../logger')


const storage = multer.memoryStorage();
const upload = multer({ storage });
const path = require("path");

const uploadToPinata = async (req, res) => {
  logger.info('Start of upload to pinata');

  const pinata = pinataSDK(
    process.env.PINATA_API_KEY,
    process.env.PINATA_SECRET_APY_KEY
  );
  const data = req.body;
  const file = req.files;
  console.log(data)
  try {
    const P = file.path;
    let readableStreamForFile = fs.createReadStream(P);
    logger.info('typeof readableStreamForFile ', typeof readableStreamForFile);
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
      logger.info('Result from pinata.pinFileToIPFS ', result);
    } catch (e) {
      logger.info('Error occured while pinFileToIPFS ', e);
    }
    data.image = process.env.PINATA_GATEWAY + result.IpfsHash;

    try {
      result = await pinata.pinJSONToIPFS(data, options);
      logger.info('Result from pinata.pinJSONToIPFS ', result);
    } catch (e) {
      logger.info('Error occured while pinJSONToIPFS ', e);
    }
    res.status(200).send(process.env.PINATA_GATEWAY + result.IpfsHash);
  } catch (err) {
    logger.info('Error occured while uploadToPinata');
     console.log(err)
    return res.status(500).send(err);
  }

};


const uploadJSONToPinata = async (data) => {
  const pinata = pinataSDK(
    process.env.PINATA_API_KEY,
    process.env.PINATA_SECRET_APY_KEY
  );
  let result;
    try {
      result = await pinata.pinJSONToIPFS(data, {});
      logger.info('Result from pinata.pinJSONToIPFS ', result);
    } catch (e) {
      console.log(e);
      logger.info('Error occured while pinJSONToIPFS ', e);
    }
    return process.env.PINATA_GATEWAY + result.IpfsHash;
}
module.exports = { uploadToPinata,uploadJSONToPinata };
