const Token = require('../models/Token')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const {
    createTokenPayload,
    createJWT,
    sendVerificationEmail,
    sendResetPassswordEmail,
    createHash,
} = require('../utils')
const CryptoJS = require('crypto-js')
const crypto = require('crypto')

const register = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            confirmPassword,
            metamaskKey,
            isAdmin,
        } = req.body
        if (!email) {
            res.status(401).json({ msg: 'Please provide an email' })
        } else if (!username) {
            res.status(401).json({ msg: 'Please provide the username' })
        } else if (!password) {
            res.status(401).json({ msg: 'Please provide the password' })
        } else if (password !== confirmPassword) {
            res.status(401).json({ msg: 'Password not match' })
        }
        const emailAlreadyExists = await User.findOne({
            email: { $regex: new RegExp(email, 'i') },
        })
        if (emailAlreadyExists) {
            res.status(401).json({ msg: 'Email already exists' })
        }

        const usernameAlreadyExists = await User.findOne({
            username: { $regex: new RegExp(username, 'i') },
        })
        if (usernameAlreadyExists) {
            res.status(500).json({ msg: 'Username already exists' })
        }

        // const walletAlreadyExists = await User.findOne({
        //     metamaskKey: { $regex: new RegExp(metamaskKey, 'i') },
        // })
        // if (walletAlreadyExists) {
        //     res.status(500).json({ msg: 'Wallet already exists' })
        // }

        hashedPassword = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString()
        const verificationToken = crypto.randomBytes(40).toString('hex')

        let createObj = {
            username,
            email,
            password: hashedPassword,
            metamaskKey,
            verificationToken,
            isAdmin,
        }
        const user = await User.create(createObj)
        const origin = process.env.APP_BACKEND_URL
        await sendVerificationEmail({
            name: user.username,
            email: user.email,
            verificationToken: user.verificationToken,
            origin,
        })

        res.status(201).json({
            msg: 'Success! Please check your email to verify account',
        })
    } catch (err) {
        console.log(err.message)
        res.status(400)
        // throw new Error('Error Occured')
    }
}

const test = async (req, res) => {
    res.send('Server Running...')
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email) {
            res.status(401).json({ msg: 'Please provide an email.' })
        } else if (!password) {
            res.status(401).json({ msg: 'Please enter the password' })
        }

        const user = await User.findOne({
            email: { $regex: new RegExp(email, 'i') },
        })

        if (!user) {
            res.status(401).json({ msg: `User doesn't exists` })
        }

        // console.log(user)
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        ).toString(CryptoJS.enc.Utf8)
        if (hashedPassword !== password) {
            res.status(401).json({ msg: 'Wrong Password!!' })
        }

        // Following code will run and see if user has verified email // update model when you will use nodmailer

        if (!user.isVerified) {
            res.status(401).json({ msg: 'Please verify your email' })
        }

        const tokenUser = createTokenPayload(user)

        // check for existing token
        const existingToken = await Token.findOne({ user: user._id })

        if (existingToken) {
            await Token.findOneAndDelete({ user: user._id })
        }

        const token = createJWT({ payload: tokenUser })
        const userAgent = req.headers['user-agent']
        const ip = req.ip
        const userToken = { token, ip, userAgent, user: user._id }

        // console.log(userToken)
        await Token.create(userToken)

        res.json({
            _id: user._id,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken: token,
        })
    } catch (e) {
        console.log(e.message)
        res.status(400)
        // throw new Error('Invalid Credentials')
    }
}

const logout = async (req, res) => {
    try {
        await Token.findOneAndDelete({ user: req.user.userId })
        res.status(201).json({ msg: 'User logged out!' })
    } catch (e) {
        console.log('Error: ' + e.message)
        res.status(500).json({ msg: e.message })
    }
}

const verifyEmail = async (req, res) => {
    try {
        const verificationToken = req.query.token
        const email = req.query.email
        const user = await User.findOne({ email })
        console.log('JK')
        if (!user) {
            res.status(401).json({ msg: 'Invalid Email' })
        }

        if (user.verificationToken === '') {
            res.status(401).json({ msg: 'User already verified' })
        }

        if (user.verificationToken !== verificationToken) {
            res.status(401).json({ msg: 'Invalid verification token' })
        }

        try {
            user.isVerified = true
            user.verifiedOn = Date.now()
            user.verificationToken = ''
            await user.save()
        } catch (err) {
            console.log(err.message)
            res.status(501).json({ msg: err.message })
        }

        res.status(201).json({ msg: 'Email Successfully Verified' })
    } catch (e) {
        res.status(500).json({ msg: e.message })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            res.status(401).json({ msg: 'Please provide valid email' })
        }

        const user = await User.findOne({
            email: { $regex: new RegExp(email, 'i') },
        })

        if (user) {
            const passwordToken = crypto.randomBytes(70).toString('hex')
            // send email
            const origin = process.env.APP_BACKEND_URL
            await sendResetPassswordEmail({
                name: user.username,
                email: user.email,
                token: passwordToken,
                origin,
            })

            console.log(passwordToken)

            const tenMinutes = 1000 * 60 * 10
            const passwordTokenExpirationDate = new Date(
                Date.now() + tenMinutes
            )

            user.passwordToken = createHash(passwordToken)
            user.passwordTokenExpirationDate = passwordTokenExpirationDate
            await user.save()

            res.status(200).json({
                msg: 'Please check your email for reset password link',
            })
        } else {
            res.status(401).json({ msg: 'Invalid User' })
        }
    } catch (e) {
        res.status(500).json({ msg: e.message })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, email, password } = req.body
        if (!email) {
            res.status(401).json({ msg: 'Please provide an email' })
        } else if (!password) {
            res.status(401).json({ msg: 'Please provide the password' })
        } else if (!token) {
            res.status(401).json({ msg: 'Please provide the token' })
        }

        const user = await User.findOne({
            email: { $regex: new RegExp(email, 'i') },
        })

        if (user) {
            const currentDate = new Date()
            console.log(createHash(token))
            if (
                !(
                    user.passwordToken === createHash(token) &&
                    user.passwordTokenExpirationDate > currentDate
                )
            ) {
                res.status(200).json({
                    msg: 'Invalid Token',
                })
            }
            hashedPassword = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.PASS_SEC
            ).toString()
            user.password = hashedPassword
            user.passwordToken = null
            user.passwordTokenExpirationDate = null
            await user.save()
            // $2a$10$NI/cqg38P7DhL8cpx50WxuXbmCr78v4yZ8pJButCQt.ZXLoE73HtG
            // $2a$10$NI/cqg38P7DhL8cpx50WxuXbmCr78v4yZ8pJButCQt.ZXLoE73HtG
            res.status(200).json({
                msg: 'Password has been successfully updated',
            })
        } else {
            res.status(200).json({ msg: 'Invalid User' })
        }
    } catch (e) {
        res.status(501).json({ msg: e.message })
    }
}

module.exports = {
    register,
    test,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
}
