const models = require('../models/User')
const CryptoJS = require('crypto-js')
const crypto = require('crypto')

const ChangePassword = async (req, res) => {
    const { previousPass, newPass, userId } = req.body
    console.log({ previousPass, newPass, userId })
    if (!userId || !previousPass || !newPass) {
        return res.json({ status: 400, msg: 'All fields required' })
    }
    try {
        const user = await models.users.findOne({ _id: userId })
        console.log(user)
        console.log(user.password, process.env.PASS_SEC)
        if (user) {
            const hashedPassword = CryptoJS.AES.decrypt(
                user.password,
                process.env.PASS_SEC
            ).toString(CryptoJS.enc.Utf8)
            console.log('PASS', hashedPassword.length)
            if (hashedPassword.length > 0) {
                console.log('PASS 2', hashedPassword.length)
                if (hashedPassword !== previousPass) {
                    console.log('PASS 3', previousPass.length)
                    return res.status(401).json({ msg: 'Wrong Password!!' })
                } else {
                    let hashedPassword = CryptoJS.AES.encrypt(
                        newPass,
                        process.env.PASS_SEC
                    ).toString()
                    user.password = hashedPassword
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
        console.log(err)
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
        console.log(user)
        console.log(user.password, process.env.PASS_SEC)
        if (user) {
            const updateProfile = await models.users.updateOne(
                { _id: userId },
                { $set: { profilePic: profilePic } }
            )
            return res.json({
                status: 400,
                msg: 'Update Profile',
                data: updateProfile,
            })
        } else {
            return res.json({ status: 400, msg: 'User not exists!' })
        }
    } catch (err) {
        console.log(err)
        res.status(501).json({ msg: err.msg })
    }
}

module.exports = { ChangePassword, updateProfile }
