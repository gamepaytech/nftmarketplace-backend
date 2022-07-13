const pinataSDK = require("@pinata/sdk");
const fs = require("fs");

const uploadToPinata = async (req, res) => {
  const pinata = pinataSDK(
    process.env.PINATA_API_KEY,
    process.env.PINATA_SECRET_API_KEY
  );
  const data = req.body;
  const file = req.file;
  console.log(file)
  console.log(data)
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
      console.log(result)
    } catch (e) {
        console.log(e)
    }
    data.image = process.env.PINATA_GATEWAY + result.IpfsHash;
    data.attributes = JSON.parse(data.attributes)

    try {
      result = await pinata.pinJSONToIPFS(data, options);
    } catch (e) {
      return res.status(500).send(e);
    }
    res.status(200).send(process.env.PINATA_GATEWAY + result.IpfsHash);
  } catch (err) {
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