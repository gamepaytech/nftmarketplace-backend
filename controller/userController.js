const models = require('../models/User')
const CryptoJS = require('crypto-js')
const crypto = require('crypto')
const logger = require('../logger')

const ChangePassword = async (req, res) => {
    const { previousPass, newPass, userId } = req.body
    logger.info({ previousPass, newPass, userId })
    if (!userId || !previousPass || !newPass) {
        return res.json({ status: 400, msg: 'All fields required' })
    }
    try {
        const user = await models.users.findOne({ _id: userId })
        // logger.info(user)
        // logger.info(user.password, process.env.PASS_SEC)
        if (user) {
            const hashedPassword = CryptoJS.AES.decrypt(
                user.password,
                process.env.PASS_SEC
            ).toString(CryptoJS.enc.Utf8)
            // logger.info('PASS', hashedPassword.length)
            if (hashedPassword.length > 0) {
                // logger.info('PASS 2', hashedPassword.length)
                if (hashedPassword !== previousPass) {
                    // logger.info('PASS 3', previousPass.length)
                    return res.status(401).json({ msg: 'Wrong Password!!' })
                } else {
                    let newHashedPassword = CryptoJS.AES.encrypt(
                        newPass,
                        process.env.PASS_SEC
                    ).toString()
                    // logger.info(newHashedPassword)
                    // logger.info(user.password)
                    const updatePass = await models.users.updateOne(
                        { _id: userId },
                        { $set: { password: newHashedPassword } }
                    )
                    // logger.info(updatePass)
                    // logger.info(user.password)
                    return res.status(200).json({
                        msg: 'Password has been successfully updated',
                    })
                }
            } else {
                return res.status(403).json({ msg: 'Wrong Password!!' })
            }
            return
        } else {
            return res.json({ status: 400, msg: 'User not exists!' })
        }
    } catch (err) {
        logger.info(err)
        res.status(501).json({ msg: err.msg })
    }
}

const updateProfile = async (req, res) => {
    const { profilePic, userId } = req.body
    if (!userId || !profilePic) {
        return res.json({ status: 400, msg: 'All fields required' })
    }
    try {
        const user = await models.users.findOne({ _id: userId })
        // logger.info(user)
        logger.info(profilePic)
        // logger.info(user.password, process.env.PASS_SEC)
        if (user) {
            const updateProfile = await models.users.updateOne(
                { _id: userId },
                { $set: { profilePic: profilePic } }
            )
            return res.json({
                status: 200,
                msg: 'Updated Image',
                data: {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    isVerified: user.isVerified,
                    isAdmin: user.isAdmin,
                    metamaskKey: user.metamaskKey || '',
                    isSuperAdmin: user.isSuperAdmin,
                    profilePic: profilePic || '',
                    // referralCode: user.referralCode,
                    accessToken: user.accessToken,
                    updatedAt: user.updatedAt,
                },
            })
        } else {
            return res.json({ status: 400, msg: 'User not exists!' })
        }
    } catch (err) {
        logger.info(err)
        res.status(501).json({ msg: err.msg })
    }
}

module.exports = { ChangePassword, updateProfile }
