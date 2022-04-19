const pinataSDK = require('@pinata/sdk')
const fs = require('fs')

const uploadToPinata = async (req, res, next) => {
    console.log('pinata')

    const pinata = pinataSDK(
        process.env.PINATA_API_KEY,
        process.env.PINATA_SECRET_KEY
    )

    //   pinata
    //     .testAuthentication()
    //     .then((result) => {
    //       //handle successful authentication here
    //       console.log(`Authentication successful ---->`, result);
    //     })
    //     .catch((err) => {
    //       //handle error here
    //       console.log(err);
    //     });

    var data = req.body
    const file = req.file
    try {
        if (!file) {
            res.status(400).json({ msg: 'Please upload an image' })
        }

        var readableStreamForFile = fs.createReadStream(file.path)

        var options = {
            pinataMetadata: {
                name: `${data.name}.img`,
            },
            pinataOptions: {
                cidVersion: 0,
            },
        }

        try {
            var ipfsResult = await pinata.pinFileToIPFS(
                readableStreamForFile,
                options
            )
        } catch (e) {
            res.status(400).json({
                msg: `Error occurred while pin file to IPFS ${e}`,
            })
        }
        const unicusUrl = 'https://unicus.mypinata.cloud/ipfs/'
        data.imageIpfs = unicusUrl + ipfsResult.IpfsHash
        // req.body.imageIpfs = data.image;
        options = {
            pinataMetadata: {
                name: `${data.name}.json`,
            },
            pinataOptions: {
                cidVersion: 0,
            },
        }

        try {
            jsonResult = await pinata.pinJSONToIPFS(data, options)
        } catch (e) {
            console.log(e, 'error')
            res.status(400).json({
                msg: 'Error occurred while pin JSON to IPFS',
            })
        }
        data.jsonIpfs = unicusUrl + jsonResult.IpfsHash
        // req.body.jsonIpfs = unicusUrl + jsonResult.IpfsHash;
        next()
    } catch (err) {
        console.log(err)
        throw new CustomError.BadRequestError(err)
    }
}

module.exports = { uploadToPinata }
