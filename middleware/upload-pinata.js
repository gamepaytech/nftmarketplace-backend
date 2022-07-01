const pinataSDK = require('@pinata/sdk')
const fs = require('fs')

const uploadToPinata = async (req, res, next) => {
    console.log('pinata')

    const pinata = pinataSDK(
        process.env.PINATA_API_KEY,
        process.env.PINATA_SECRET_KEY
    )

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
        const gamePayGateWay = process.env.PINATA_GATEWAY
        data.imageIpfs = gamePayGateWay + ipfsResult.IpfsHash
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
        req.body.jsonIpfs = gamePayGateWay + jsonResult.IpfsHash;
        next()
    } catch (err) {
        console.log(err)
        throw new CustomError.BadRequestError(err)
    }
}

module.exports = { uploadToPinata }
