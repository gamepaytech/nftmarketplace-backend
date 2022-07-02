const pinataSDK = require("@pinata/sdk");
const multer = require("multer");
const fs = require("fs");
const logger = require('../logger')
// const {fs} = require('memfs')


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
  const buf = Buffer.from(data.image, "base64");
  fs.writeFileSync(data.name, buf);
    const read = fs.createReadStream(data.name);
  try {
    const options = {
      pinataMetadata: {
        name: `${data.name}.img`,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };
    let result = await pinata.pinFileToIPFS(read, options);
      logger.info('Result from pinata.pinFileToIPFS ', result);
      const newData =  {
        name : data.name,
        image : process.env.PINATA_GATEWAY + result.IpfsHash,
        nftType: data.nftType,
        description : data.description,
        "traits": [
        {
          "trait_type": "Attack",
          "value": data.attack,
          "display_type": "number",
          "max_value": 5,
          "trait_count": 3,
          "order": null
        },
        {
          "trait_type": "Health",
          "value": data.hp,
          "display_type": "number",
          "max_value": 5,
          "trait_count": 2,
          "order": null
        },
        {
          "trait_type": "Gender",
          "value": data.Gender,
          "display_type": null,
          "max_value": null,
          "trait_count": 1,
          "order": null
        },
        {
          "trait_type": "Color",
          "value": data.nftAttributesColour,
          "display_type": null,
          "max_value": null,
          "trait_count": 1,
          "order": null
        },
        {
          "trait_type": "class",
          "value": data.Class,
          "display_type": null,
          "max_value": null,
          "trait_count": 1,
          "order": null
        },
        {
          "trait_type": "Accessories",
          "value": data.Accessories,
          "display_type": null,
          "max_value": null,
          "trait_count": 1,
          "order": null
        },
        {
          "trait_type": "others",
          "value": data.others,
          "display_type": null,
          "max_value": null,
          "trait_count": 1,
          "order": null
        },
        {
          "trait_type": "breedCount",
          "value": data.breedCount,
          "display_type": null,
          "max_value": null,
          "trait_count": 1,
          "order": null
        }]}
      result = await pinata.pinJSONToIPFS(newData, options);
      logger.info('Result from pinata.pinJSONToIPFS ', result);
    res.status(200).send(process.env.PINATA_GATEWAY + result.IpfsHash);
  } catch (err) {
    logger.info('Error occured while uploadToPinata');
    return res.status(500).send(err);
  }

};


module.exports = { uploadToPinata }
