const Token = require('../models/Token')
const models = require('../models/User')
const referralModel = require('../models/referralModel')
const CryptoJS = require('crypto-js')
const crypto = require('crypto')
const {
    createTokenPayload,
    createJWT,
    sendVerificationEmail,
    sendResetPassswordEmail,
    createHash,
    createWalletAddressPayload,
} = require('../utils')

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
        const emailAlreadyExists = await models.users.findOne({
            email: { $regex: new RegExp(email, 'i') },
        })
        if (emailAlreadyExists) {
            res.status(401).json({ msg: 'Email already exists' })
        }

        const usernameAlreadyExists = await models.users.findOne({
            username: { $regex: new RegExp(username, 'i') },
        })
        if (usernameAlreadyExists) {
            res.status(500).json({ msg: 'Username already exists' })
        }

        hashedPassword = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString()
        const verificationToken = crypto.randomBytes(40).toString('hex')
        let referralCode = await getReferralCode()
        let createObj = {
            username: username,
            email: email,
            password: hashedPassword,
            metamaskKey: metamaskKey,
            verificationToken: verificationToken,
            isAdmin: isAdmin == 'True' ? true : false,
            referralCode: referralCode.code,
        }
        const user = await models.users.create(createObj)
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
        console.log(err.msg)
        res.status(400)
        // throw new Error('Error Occured')
    }
}

const test = async (req, res) => {
    res.send('Server Running...')
}

const login = async (req, res) => {
    try {
        const { email, password, walletAddress } = req.body

        if (walletAddress && walletAddress.length > 0) {
            // var regex = new RegExp(`^${walletAddress.trim()}$`, 'ig')
            const user = await models.users.findOne({
                metamaskKey: walletAddress,
            })

            if (user) {
                if (user.isVerified) {
                    const tokenUser = createWalletAddressPayload(
                        user,
                        walletAddress
                    )

                    const existingToken = await Token.findOne({
                        user: user._id,
                    })

                    if (existingToken) {
                        await Token.findOneAndDelete({ user: user._id })
                    }

                    const token = createJWT({ payload: tokenUser })
                    const userAgent = req.headers['user-agent']
                    const ip = req.ip
                    const userToken = { token, ip, userAgent, user: user._id }

                    console.log(userToken)
                    await Token.create(userToken)

                    res.status(200).json({
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                        isVerified: user.isVerified,
                        isAdmin: user.isAdmin,
                        metamaskKey: user.metamaskKey || '',
                        isSuperAdmin: user.isSuperAdmin,
                        referralCode: user.referralCode,
                        accessToken: token,
                    })
                } else {
                    res.status(400).json({
                        msg: `Please verify your Email Address ${user.email}`,
                    })
                }
            } else {
                res.status(400).json({ msg: 'Wallet Address Not Registered' })
            }
        } else {
            if (!email || email === '') {
                res.status(401).json({ msg: 'Please provide an email.' })
                return
            } else if (!password || password === '') {
                res.status(401).json({ msg: 'Please enter the password' })
                return
            }

            const user = await models.users.findOne({
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
                isVerified: user.isVerified,
                isAdmin: user.isAdmin,
                metamaskKey: user.metamaskKey || '',
                isSuperAdmin: user.isSuperAdmin,
                referralCode: user.referralCode,
                accessToken: token,
            })
        }
    } catch (e) {
        console.log(e.msg)
        res.status(400)
        // throw new Error('Invalid Credentials')
    }
}

const logout = async (req, res) => {
    try {
        await Token.findOneAndDelete({ user: req.user.userId })
        res.status(201).json({ msg: 'User logged out!' })
    } catch (e) {
        console.log('Error: ' + e.msg)
        res.status(500).json({ msg: e.msg })
    }
}

const verifyEmail = async (req, res) => {
    try {
        const verificationToken = req.query.token
        const email = req.query.email

        if (verificationToken === '' || !verificationToken) {
            res.status(401).json({ msg: 'Invalid Credentials!' })
            return
        }

        if (email === '' || !email) {
            res.status(401).json({ msg: 'Invalid Credentials!' })
            return
        }

        const user = await models.users.findOne({ email })
        console.log('JK')
        if (user) {
            if (user.verificationToken === '') {
                res.status(401).json({ msg: 'User already verified' })
                return
            }

            if (user.verificationToken !== verificationToken) {
                res.status(401).json({ msg: 'Invalid verification token' })
                return
            }

            try {
                user.isVerified = true
                user.verifiedOn = Date.now()
                user.verificationToken = ''
                await user.save()
            } catch (err) {
                console.log(err.msg)
                res.status(501).json({ msg: err.msg })
            }

            res.status(201).json({ msg: 'Email Successfully Verified' })
        } else {
            res.status(401).json({ msg: 'Invalid Request' })
        }
    } catch (e) {
        res.status(500).json({ msg: e.msg })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            res.status(401).json({ msg: 'Please provide valid email' })
        }

        const user = await models.users.findOne({
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
        res.status(500).json({ msg: e.msg })
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

        const user = await models.users.findOne({
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
        res.status(501).json({ msg: e.msg })
    }
}

const addMyReferral = async function (req, res) {
    try {
        let refereeCode = req.query.code || ''

        let keys = ['email', 'username', 'password']
        for (i in keys) {
            if (req.body[keys[i]] == undefined || req.body[keys[i]] == '') {
                res.json({ status: 401, msg: keys[i] + ' are required' })
                return
            }
        }

        query = { email: req.body.email }
        const checkMail = await models.users.findOne(query)
        if (checkMail) {
            res.json({ status: 400, msg: 'Email already in use' })
        } else {
            query = { username: { $regex: new RegExp(req.body.username, 'i') } }
            const checkUserName = await models.users.findOne(query)
            if (checkUserName) {
                res.json({ status: 400, msg: 'Username already exists' })
            } else {
                let checkReferee = false
                if (refereeCode != '') {
                    checkReferee = true
                }
                if (checkReferee) {
                    query = { referralCode: refereeCode }
                    const checkReferralCode = await models.users.findOne(query)
                    if (checkReferralCode) {
                        let referralCode = await getReferralCode()
                        const verificationToken = crypto
                            .randomBytes(40)
                            .toString('hex')
                        let hashedPassword = CryptoJS.AES.encrypt(
                            req.body.password,
                            process.env.PASS_SEC
                        ).toString()
                        query = {
                            username: req.body.username,
                            email: req.body.email,
                            password: hashedPassword,
                            metamaskKey: req.body.metamaskKey || '',
                            verificationToken: verificationToken,
                            isAdmin:
                                req.body.isAdmin !== undefined &&
                                req.body.isAdmin == 'True'
                                    ? true
                                    : false,
                            isSuperAdmin:
                                req.body.isSuperAdmin !== undefined &&
                                req.body.isSuperAdmin == 'True'
                                    ? true
                                    : false,
                            referralCode: referralCode.code,
                            refereeCode: refereeCode,
                        }
                        const newUser = new models.users(query)
                        const insertNewReferral = await newUser.save()
                        if (insertNewReferral) {
                            query = {
                                userId: insertNewReferral._id,
                                referredBy: checkReferralCode._id,
                            }
                            const newReferral = new referralModel.myReferral(
                                query
                            )
                            const mapReferral = await newReferral.save()
                            if (mapReferral) {
                                const newUserInfo = await models.users.findById(
                                    insertNewReferral._id
                                )
                                sendVerificationEmail({
                                    name: newUserInfo.username,
                                    email: newUserInfo.email,
                                    verificationToken:
                                        newUserInfo.verificationToken,
                                    origin: process.env.APP_BACKEND_URL,
                                })
                                if (newUserInfo) {
                                    res.status(201).json({
                                        msg: 'Success! Please check your email to verify account',
                                    })
                                } else {
                                    res.json({
                                        status: 400,
                                        msg: 'Something went Wrong',
                                    })
                                }
                            } else {
                                res.json({
                                    status: 400,
                                    msg: 'Something went Wrong',
                                })
                            }
                        } else {
                            res.json({
                                status: 400,
                                msg: 'User not created. Please try again',
                            })
                        }
                    } else {
                        res.json({
                            status: 400,
                            msg: 'invalid referral code',
                        })
                    }
                } else {
                    let referralCode = await getReferralCode()
                    const verificationToken = crypto
                        .randomBytes(40)
                        .toString('hex')
                    let hashedPassword = CryptoJS.AES.encrypt(
                        req.body.password,
                        process.env.PASS_SEC
                    ).toString()
                    query = {
                        username: req.body.username,
                        email: req.body.email,
                        password: hashedPassword,
                        metamaskKey: req.body.metamaskKey || '',
                        verificationToken: verificationToken,
                        isAdmin:
                            req.body.isAdmin !== undefined &&
                            req.body.isAdmin == 'True'
                                ? true
                                : false,
                        isSuperAdmin:
                            req.body.isSuperAdmin !== undefined &&
                            req.body.isSuperAdmin == 'True'
                                ? true
                                : false,
                        referralCode: referralCode.code,
                        refereeCode: refereeCode,
                    }
                    const newUser = new models.users(query)
                    const insertNewReferral = await newUser.save()
                    if (insertNewReferral) {
                        const newUserInfo = await models.users.findById(
                            insertNewReferral._id
                        )
                        sendVerificationEmail({
                            name: newUserInfo.username,
                            email: newUserInfo.email,
                            verificationToken: newUserInfo.verificationToken,
                            origin: process.env.APP_BACKEND_URL,
                        })
                        if (newUserInfo) {
                            res.status(201).json({
                                msg: 'Success! Please check your email to verify account',
                            })
                        } else {
                            res.json({
                                status: 400,
                                msg: 'Something went Wrong',
                            })
                        }
                    } else {
                        res.json({
                            status: 400,
                            msg: 'User not created. Please try again',
                        })
                    }
                }
            }
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

function getReferralCode() {
    return new Promise(async (resolve, reject) => {
        var newCode = ''
        let arr =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

        for (var i = 8; i > 0; i--) {
            newCode += arr[Math.floor(Math.random() * arr.length)]
        }

        const getNewReferralCode = await models.users.findOne({
            referralCode: newCode,
        })
        if (getNewReferralCode) {
            getReferralCode()
        } else {
            resolve({ code: newCode })
        }
    })
}

const getAllMyReferrals = async function (req, res) {
    try {
        const getMyReferralsId = await referralModel.myReferral.find(
            { referredBy: req.body.userId },
            { _id: 0, userId: 1 }
        )
        let Ids = []
        for (let i = 0; i < getMyReferralsId.length; i++) {
            Ids.push(getMyReferralsId[i].userId)
        }
        console.log(Ids)

        if (getMyReferralsId.length) {
            const getMyReferrals = await models.users.find(
                { _id: { $in: Ids } },
                // { _id: getMyReferralsId[0].userId },
                { __v: 0 }
            )
            if (getMyReferrals) {
                res.json({
                    status: 200,
                    msg: 'Success',
                    data: getMyReferrals,
                })
            } else {
                res.json({
                    status: 400,
                    msg: 'Something went wrong',
                    data: {},
                })
            }
        } else {
            res.json({ status: 400, msg: 'No Referrals Found' })
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const getAllSuperAdmin = async function (req, res) {
    try {
        const superAdmin = await models.users.find({ isSuperAdmin: true })

        if (superAdmin && superAdmin.length) {
            res.json({ status: 200, msg: 'Success', data: superAdmin })
        } else {
            res.json({ status: 200, msg: 'No SuperUser Found' })
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const getAllAdmin = async function (req, res) {
    try {
        const admin = await models.users.find({ isAdmin: true })

        if (admin && admin.length) {
            res.json({ status: 200, msg: 'Success', data: admin })
        } else {
            res.json({ status: 200, msg: 'No SuperUser Found' })
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const changeUserStatus = async function (req, res) {
    let userId
    if (req.body.email) {
        const userData = await models.users.findOne({ email: req.body.email })
        userId = userData._id
    } else if (req.body.walletAddr) {
        const userData = await models.users.findOne({
            metamaskKey: req.body.walletAddr,
        })
        userId = userData._id
    }
    try {
        // if (req.body.walletAddress == undefined || req.body.walletAddress == ''){
        //     res.json({status: 400, msg: "walletAddress is required"})
        //     return
        // }

        if (req.body.status == undefined || req.body.status == 0) {
            res.json({ status: 400, msg: 'status is required' })
            return
        }

        if (userId == undefined || userId == '') {
            res.json({ status: 400, msg: 'userId is required' })
            return
        }

        // Status -> 11 [Add Admin]
        // Status -> 12 [Delete Admin]
        // Status -> 21 [Add Super Admin]
        // Status -> 22 [Delete Super Admin]

        const userInfo = await models.users.find({ _id: userId })
        if (userInfo && userInfo.length) {
            // let changeUserWalletAddress = await models.users.updateOne(
            //     {metamaskKey: userInfo[0].metamaskKey},
            //     {'$set': {metamaskKey: req.body.walletAddr}}
            // )
            if (req.body.status === 11 || req.body.status === 12) {
                try {
                    const makeAdmin = await models.users.updateOne(
                        {
                            _id: userId,
                        },
                        {
                            $set: {
                                isAdmin: req.body.status == 11 ? true : false,
                                isSuperAdmin:
                                    req.body.status == 12
                                        ? false
                                        : userInfo[0].isSuperAdmin,
                            },
                        }
                    )
                    res.json({
                        status: 200,
                        msg: 'Success',
                        data: makeAdmin,
                    })

                    return
                } catch (err) {
                    console.log(err)
                    res.json({ status: 400, msg: 'Something went wrong' })
                    return
                }
            } else if (req.body.status === 21 || req.body.status === 22) {
                try {
                    const makeSuperAdmin = await models.users.updateOne(
                        {
                            _id: userId,
                        },
                        {
                            $set: {
                                isSuperAdmin:
                                    req.body.status == 21 ? true : false,
                                isAdmin: req.body.status == 22 ? false : true,
                            },
                        }
                    )
                    res.json({
                        status: 200,
                        msg: 'Success',
                        data: makeSuperAdmin,
                    })

                    return
                } catch (err) {
                    console.log(err)
                    res.json({ status: 400, msg: 'Something went wrong' })
                    return
                }
            }
            // let changeUserStatus
            // if (changeUserWalletAddress.modifiedCount == 1) {
            //     if (req.body.status == 1) {
            //         changeUserStatus = await models.users.updateOne(
            //             { isSuperAdmin: userInfo[0].isSuperAdmin },
            //             {
            //                 $set: {
            //                     isSuperAdmin:
            //                         req.body.status == 1 ? true : false,
            //                 },
            //             }
            //         )
            //     } else {
            //         changeUserStatus = await models.users.updateOne(
            //             { isAdmin: userInfo[0].isAdmin },
            //             {
            //                 $set: {
            //                     isAdmin: req.body.status == 1 ? true : false,
            //                 },
            //             }
            //         )
            //     }
            // }

            // if (changeUserStatus.modifiedCount == 1) {
            //     const updatedUserInfo = await models.users.find({
            //         _id: req.body.userId,
            //     })
            //     res.json({ status: 200, msg: 'Success', data: updatedUserInfo })
            // } else {
            //     res.json({ status: 400, msg: 'Something went wrong' })
            // }
        } else {
            res.json({ status: 400, msg: 'User not found' })
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const addWalletKey = async (req, res) => {
    try {
        const userId = req.body.userId
        const walletAddress = req.body.walletAddress
        if (userId == undefined || userId == '') {
            res.json({ status: 400, msg: 'status is required' })
            return
        }
        if (walletAddress == undefined || walletAddress == '') {
            res.json({ status: 400, msg: 'walletAddress is required' })
            return
        }

        const userInfo = await models.users.find({ _id: userId })

        if (userInfo !== undefined || userInfo !== '') {
            if (userInfo[0].metamaskKey.length == 5) {
                res.json({ status: 400, msg: 'wallet limit exceed' })
                return
            }

            if (userInfo[0].metamaskKey.includes(req.body.walletAddress)) {
                res.json({
                    status: 400,
                    msg: 'User already exists with this wallet',
                })
                return
            }

            const walletInfo = await models.users.find({
                metamaskKey: { $in: [req.body.walletAddress] },
            })

            if (walletInfo && walletInfo.length) {
                res.json({
                    status: 400,
                    msg: 'Wallet Address id already used by other email',
                })
                return
            }

            const updatedUser = await models.users.updateOne(
                {
                    _id: req.body.userId,
                },
                {
                    $push: {
                        metamaskKey: walletAddress,
                    },
                }
            )
            res.json({
                status: 200,
                msg: 'Success',
                data: updatedUser,
            })

            return
        } else {
            res.json({ status: 400, msg: 'Invalid Credentials!' })
        }
    } catch (error) {
        console.log(error)
        res.json({ status: 400, msg: error.toString() })
    }
}

const removeWalletKey = async function (req, res) {
    try {
        if (req.body.userId == undefined || req.body.userId == '') {
            res.json({ status: 400, msg: 'userId is required' })
            return
        }

        if (
            req.body.walletAddress == undefined ||
            req.body.walletAddress == ''
        ) {
            res.json({ status: 400, msg: 'walletKey is required' })
            return
        }

        const userInfo = await models.users.findOne({
            _id: req.body.userId,
            metamaskKey: req.body.walletAddress,
        })

        if (userInfo) {
            const updateUserInfo = await models.users.updateOne(
                { _id: req.body.userId },
                { $pull: { metamaskKey: req.body.walletAddress } }
            )

            if (updateUserInfo.modifiedCount > 0) {
                res.json({
                    status: 200,
                    msg: 'Wallet Removed',
                    data: updateUserInfo,
                })
            } else {
                res.json({ status: 400, msg: 'Wallet Not Removed' })
            }
        } else {
            res.json({ status: 400, msg: 'user not found' })
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const getAllWallet = async function (req, res) {
    try {
        if (req.body.userId == undefined || req.body.userId == '') {
            res.json({ status: 400, msg: 'userId is required' })
            return
        }

        const walletInfo = await models.users.find(
            { _id: req.body.userId },
            { metamaskKey: 1 }
        )

        if (walletInfo && walletInfo.length) {
            res.json({ status: 200, msg: 'Success', data: walletInfo })
        } else {
            res.json({ sttaus: 400, msg: 'No Wallets found' })
        }
    } catch (error) {
        res.json({ status: 400, msg: eror.toString() })
    }
}

const checkRegisterredWallet = async (req, res) => {
    try {
        const walletAddress = req.body.walletAddress
        if (walletAddress == undefined || walletAddress == '') {
            res.json({ status: 400, msg: 'Wallet Address is required' })
            return
        }
        const userInfo = await models.users.find({
            metamaskKey: walletAddress,
        })
        if (userInfo !== undefined || userInfo !== '') {
            res.json({
                status: 200,
                msg: 'Success',
                data: userInfo,
            })
            return
        } else {
            res.json({ status: 400, msg: 'User not Registered!' })
        }
    } catch (error) {
        console.log(error)
        res.json({ status: 400, msg: error.toString() })
    }
}

const checkWalletKey = async function (req, res) {
    try {
        if (req.body.userId == undefined || req.body.userId == '') {
            res.json({ status: 400, msg: 'userId is required' })
            return
        }

        if (
            req.body.walletAddress == undefined ||
            req.body.walletAddress == ''
        ) {
            res.json({ status: 400, msg: 'walletKey is required' })
            return
        }

        const walletInfo = await models.users.find({
            _id: req.body.userId,
            metamaskKey: req.body.walletAddress,
        })

        if (walletInfo && walletInfo.length) {
            res.json({ status: 200, msg: 'Success', data: walletInfo[0] })
        } else {
            res.json({ status: 400, msg: 'Wallet not found' })
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const getPercent = async function (req, res) {
    try {
        const setting = await referralModel.appsetting.find({})
        res.json({ status: 200, msg: 'Success', data: setting })
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const updatePercent = async function (req, res) {
    try {
        if (req.body.userId == undefined || req.body.userId == '') {
            res.json({ status: 400, msg: 'userId is required' })
            return
        }

        if (req.body.percent == undefined || req.body.percent == '') {
            res.json({ status: 400, msg: 'percent is required' })
            return
        }

        const userInfo = await models.users.find({
            _id: req.body.userId,
            isSuperAdmin: true,
        })
        if (userInfo) {
            const setting = await referralModel.appsetting.updateOne({
                referralPercent: req.body.percent,
            })
            if (setting.modifiedCount > 0) {
                const newSetting = await referralModel.appsetting.find({})
                res.json({ status: 200, msg: 'Success', data: newSetting })
            } else {
                res.json({ status: 400, msg: 'Something went Wrong' })
            }
        } else {
            res.json({ status: 400, msg: 'Action Not Permitted' })
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
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
    getAllMyReferrals,
    addMyReferral,
    getAllSuperAdmin,
    getAllAdmin,
    changeUserStatus,
    checkRegisterredWallet,
    addWalletKey,
    removeWalletKey,
    getAllWallet,
    checkWalletKey,
    getPercent,
    updatePercent,
}
