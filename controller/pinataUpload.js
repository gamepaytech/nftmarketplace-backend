const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const logger = require('../logger')

const uploadToPinata = async (req, res) => {
  const pinata = pinataSDK(
    process.env.PINATA_API_KEY,
    process.env.PINATA_SECRET_API_KEY
  );
  const data = req.body;
  const file = req.file;
  try {
    const P = file.path;
    let readableStreamForFile = fs.createReadStream(P);
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
      logger.error(e,"error")
      return res.status(500).send(e);
    }
    data.image = process.env.PINATA_GATEWAY + result.IpfsHash;
    data.attributes = JSON.parse(data.attributes)

    try {
      result = await pinata.pinJSONToIPFS(data, options);
    } catch (e) {
      logger.error(e,"error")
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