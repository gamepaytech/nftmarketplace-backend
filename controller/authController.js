const mongoose = require('mongoose')
const Token = require('../models/Token')
const models = require('../models/User')
const referralModel = require('../models/referralModel')
const sysConfig = require('../models/SystemConfiguration')
const CryptoJS = require('crypto-js')
const crypto = require('crypto')
const {
    createTokenPayload,
    createJWT,
    sendVerificationEmail,
    sendResetPassswordEmail,
    createHash,
    createWalletAddressPayload,
    getSystemMessage
} = require('../utils')
const logger = require('../logger')

const register = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            confirmPassword,
            metamaskKey,
        } = req.body
        if (!email) {
            const sysMsg = await getSystemMessage('GPAY_00001_EMAIL_REQUIRED')
            res.status(401).json({ msg: sysMsg ? sysMsg.message :'Please provide an email' })
        } else if (!username) {
            const sysMsg = await getSystemMessage('GPAY_00002_USERNAME_REQUIRED')
            res.status(401).json({ msg: sysMsg ? sysMsg.message :'Please provide the username' })
        } else if (!password) {
            const sysMsg = await getSystemMessage('GPAY_00003_PASSWORD_REQUIRED')
            res.status(401).json({ msg: sysMsg ? sysMsg.message :'Please provide the password' })
        } else if (password !== confirmPassword) {
            const sysMsg = await getSystemMessage('GPAY_00004_PASSWORD_MISMATCH')
            res.status(401).json({ msg: sysMsg ? sysMsg.message :'Password not match' })
        }
        const emailAlreadyExists = await models.users.findOne({
            email: email,
        })
        if (emailAlreadyExists) {
            const sysMsg = await getSystemMessage('GPAY_00005_EMAIL_USERNAME_EXISTS')
            res.status(401).json({ msg: sysMsg ? sysMsg.message :'Email or username already exists' })
        }

        const usernameAlreadyExists = await models.users.findOne({
            username: username,
        })
        if (usernameAlreadyExists) {
            const sysMsg = await getSystemMessage('GPAY_00005_EMAIL_USERNAME_EXISTS')
            res.status(401).json({ msg: sysMsg ? sysMsg.message :'Email or username already exists' })
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
            referralCode: username,
        }

        logger.info('BEFORE SEDING--- ',verificationToken)
        const user = await models.users.create(createObj)
        const origin = process.env.APP_BACKEND_URL
        await sendVerificationEmail({
            name: user.username,
            email: user.email,
            verificationToken: user.verificationToken,
            origin,
        })
        logger.info('AFTER SENDING--- ',user.verificationToken)
        
        const sysMsg = await getSystemMessage('GPAY_00006_VERIFY_EMAIL')
        res.status(201).json({
            msg: sysMsg ? sysMsg.message : 'Success! Please check your email to verify account',
            status:201
        })
    } catch (err) {
        logger.info(err.msg)
        res.status(400)
    }
}

const test = async (req, res) => {
    res.send('Server Running...')
}

const login = async (req, res) => {
    try {
        const { email, password, walletAddress } = req.body

        if (walletAddress && walletAddress.length > 0) {
            const user = await models.users.findOne({
                metamaskKey: walletAddress[0],
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

                    logger.info(userToken)
                    await Token.create(userToken)

                    res.status(200).json({
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                        isVerified: user.isVerified,
                        isAdmin: user.isAdmin,
                        metamaskKey: user.metamaskKey || '',
                        isSuperAdmin: user.isSuperAdmin,
                        profilePic: user.profilePic || '',
                        referralCode: user.referralCode,
                        refereeCode: user.refereeCode || '',
                        accessToken: token,
                        updatedAt: user.updatedAt,
                    })
                } else {                   
                    const sysMsg = await getSystemMessage('GPAY_00007_VERIFY_EMAIL_AT')
                    res.status(400).json({
                        msg: sysMsg ? (sysMsg.message + user.email) : `Please verify your Email Address ${user.email}`,
                    })
                }
            } else {
                const sysMsg = await getSystemMessage('GPAY_00008_WALLET_ADDRESS_NOT_REGISTERED')
                res.status(400).json({ msg: sysMsg ? sysMsg.message : 'Wallet Address Not Registered' })
            }
        } else {
            if (!email || email === '') {
                const sysMsg = await getSystemMessage('GPAY_00001_EMAIL_REQUIRED')
                res.status(401).json({ msg: sysMsg ? sysMsg.message :'Please provide an email' })
                return
            } else if (!password || password === '') {
                const sysMsg = await getSystemMessage('GPAY_00009_ENTER_PASSWORD')
                res.status(401).json({ msg: sysMsg ? sysMsg.message : 'Please enter the password' })
                return
            }

            const user = await models.users.findOne({
                email: email,
            })

            if (!user) {
                const sysMsg = await getSystemMessage('GPAY_00010_USER_NOT_EXISTS')
                res.status(401).json({ msg: sysMsg ? sysMsg.message : `User doesn't exist` })
            }
            
            const hashedPassword = CryptoJS.AES.decrypt(
                user.password,
                process.env.PASS_SEC
            ).toString(CryptoJS.enc.Utf8)
            if (hashedPassword !== password) {
                const sysMsg = await getSystemMessage('GPAY_00011_WRONG_PASSWORD')
                res.status(401).json({ msg: sysMsg ? sysMsg.message : 'Wrong Password!!' })
            }

            // Following code will run and see if user has verified email // update model when you will use nodmailer

            if (!user.isVerified) {                
                const sysMsg = await getSystemMessage('GPAY_00012_VERIFY_EMAIL')
                res.status(401).json({ msg: sysMsg ? sysMsg.message : 'Please verify your email' })
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
                profilePic: user.profilePic || '',
                accessToken: token,
                updatedAt: user.updatedAt,
            })
        }
    } catch (e) {
        logger.info(e.msg)
        res.status(400)
        // throw new Error('Invalid Credentials')
    }
}

const logout = async (req, res) => {
    try {
        await Token.findOneAndDelete({ user: req.user.userId })
        const sysMsg = await getSystemMessage('GPAY_00013_USER_LOGGED_OUT')
        res.status(201).json({ msg: sysMsg ? sysMsg.message : 'User logged out!' })
    } catch (e) {
        logger.info('Error: ' + e.msg)
        res.status(500).json({ msg: e.msg })
    }
}

const verifyEmail = async (req, res) => {
    try {
        const verificationToken = req.body.token
        const email = req.body.email

        logger.info('EMAIL ',email)
        logger.info('TOKEN ',verificationToken)
        if (verificationToken === '' || !verificationToken) {
            const sysMsg = await getSystemMessage('GPAY_00014_INVALID_CREDENTIALS')
            res.status(401).json({ msg: sysMsg ? sysMsg.message : 'Invalid Credentials!' })
            return
        }

        if (email === '' || !email) {
            const sysMsg = await getSystemMessage('GPAY_00015_INVALID_EMAIL_OR_PASSWORD')
            res.status(401).json({ msg: sysMsg ? sysMsg.message : 'Invalid email or password!' })
            return
        }

        const user = await models.users.findOne({ email })
        logger.info('user ',user);
        if (user) {
            if (user.verificationToken === '') {
                const sysMsg = await getSystemMessage('GPAY_00016_USER_ALREADY_VERIFIED')
                res.status(401).json({ msg: sysMsg ? sysMsg.message : 'User already verified' })
                return
            }

            if (user.verificationToken !== verificationToken) {
                const sysMsg = await getSystemMessage('GPAY_00017_INVALID_TOKEN')
                res.status(401).json({ msg: sysMsg ? sysMsg.message : 'Invalid verification token' })
                return
            }

            try {
                user.isVerified = true
                user.verifiedOn = Date.now()
                user.verificationToken = ''
                await user.save()
            } catch (err) {
                logger.info(err.msg)
                res.status(501).json({ msg: err.msg })
            }
            const sysMsg = await getSystemMessage('GPAY_00018_EMAIL_VERIFIED')
            res.status(201).json({ msg: sysMsg ? sysMsg.message : 'Email Successfully Verified' })
        } else {
            const sysMsg = await getSystemMessage('GPAY_00019_INVAILD_REQUEST')
            res.status(401).json({ msg: sysMsg ? sysMsg.message : 'Invalid Request' })
        }
    } catch (e) {
        res.status(500).json({ msg: e.msg })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {            
            const sysMsg = await getSystemMessage('GPAY_00020_VAILD_EMAIL')
            res.status(401).json({ msg: sysMsg ? sysMsg.message : 'Please provide valid email' })
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

            logger.info(passwordToken)

            const tenMinutes = 1000 * 60 * 10
            const passwordTokenExpirationDate = new Date(
                Date.now() + tenMinutes
            )

            user.passwordToken = createHash(passwordToken)
            user.passwordTokenExpirationDate = passwordTokenExpirationDate
            await user.save()

            const sysMsg = await getSystemMessage('GPAY_00021_CHECK_EMAIL_RESET_LINK')
            res.status(200).json({
                msg: sysMsg ? sysMsg.message : 'Please check your email for reset password link',
            })
        } else {
            const sysMsg = await getSystemMessage('GPAY_00022_INVALID_USER')
            res.status(401).json({ msg: sysMsg ? sysMsg.message : 'Invalid User' })
        }
    } catch (e) {
        res.status(500).json({ msg: e.msg })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, email, password } = req.body
        if (!email) {
            const sysMsg = await getSystemMessage('GPAY_00001_EMAIL_REQUIRED')
            res.status(401).json({ msg: sysMsg ? sysMsg.message : 'Please provide an email' })
        } else if (!password) {
            const sysMsg = await getSystemMessage('GPAY_00003_PASSWORD_REQUIRED')
            res.status(401).json({ msg: sysMsg ? sysMsg.message : 'Please provide the password' })
        } else if (!token) {            
            const sysMsg = await getSystemMessage('GPAY_00023_TOKEN_REQUIRED')
            res.status(401).json({ msg: sysMsg ? sysMsg.message : 'Please provide the token' })
        }

        const user = await models.users.findOne({
            email: { $regex: new RegExp(email, 'i') },
        })

        if (user) {
            const currentDate = new Date()
            logger.info(createHash(token))
            if (
                !(
                    user.passwordToken === createHash(token) &&
                    user.passwordTokenExpirationDate > currentDate
                )
            ) {                
                const sysMsg = await getSystemMessage('GPAY_00024_INVALID_TOKEN')
                res.status(200).json({
                    msg: sysMsg ? sysMsg.message : 'Invalid Token',
                })
            }
            let hashedPassword = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.PASS_SEC
            ).toString()
            user.password = hashedPassword
            user.passwordToken = null
            user.passwordTokenExpirationDate = null
            await user.save()
            
            const sysMsg = await getSystemMessage('GPAY_00025_PASSWORD_UPDATED')
            res.status(200).json({
                msg: sysMsg ? sysMsg.message : 'Password has been successfully updated',
            })
        } else {
            const sysMsg = await getSystemMessage('GPAY_00022_INVALID_USER')
            res.status(200).json({ msg: sysMsg ? sysMsg.message : 'Invalid User' })
        }
    } catch (e) {
        res.status(501).json({ msg: e.msg })
    }
}

const addMyReferral = async function (req, res) {
    try {
        let refereeCode = ''
        if(req.body.code) {
            refereeCode = req.body.code;
        }
        let keys = ['email', 'username', 'password']
        for (i in keys) {
            if (req.body[keys[i]] == undefined || req.body[keys[i]] == '') {
                res.json({ status: 401, msg: keys[i] + ' are required' })
                return
            }
        }
        let referralCode = await getReferralCode()
        const commissionRate = await sysConfig.findOne({config_name:"BASE_COMMISSION"})
        query = { email: req.body.email }
        const checkMail = await models.users.findOne({ "$or": [ { email: req.body.email }, { username: req.body.username} ] })
        if (checkMail) {
        if (checkMail.username === req.body.username) {
            const sysMsg = await getSystemMessage('GPAY_00026_USERNAME_IN_USE')
            res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'Username already in use' })
        } else {
            const sysMsg = await getSystemMessage('GPAY_00026_EMAIL_IN_USE')
            res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'EMAIL already in use' })
        }
        } else {
            query = { username: { $regex: new RegExp(req.body.username, 'i') } }
            const checkUserName = await models.users.findOne(query)
            if (checkUserName) {
                const sysMsg = await getSystemMessage('GPAY_00026_EMAIL_USERNAME_IN_USE')
                res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'Email or Username already in use' })
            } else {
                let checkReferee = false
                if (refereeCode != '') {
                    checkReferee = true
                }
                if (checkReferee) {
                    query = { referralCode: refereeCode }
                    const checkReferralCode = await referralModel.referralDetails.findOne(query)
                    if (checkReferralCode) {
                        const verificationToken = crypto
                            .randomBytes(40)
                            .toString('hex')
                        let hashedPassword = CryptoJS.AES.encrypt(
                            req.body.password,
                            process.env.PASS_SEC
                        ).toString()
                        if(req.body.metamaskKey) {
                            query = {
                                username: req.body.username,
                                email: req.body.email,
                                password: hashedPassword,
                                metamaskKey: req.body.metamaskKey,
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
                                refereeCode: refereeCode,
                            }
                        }
                        else {
                            query = {
                                username: req.body.username,
                                email: req.body.email,
                                password: hashedPassword,
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
                                refereeCode: refereeCode,
                            }
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
                            const addMyReferral = new referralModel.referralDetails({
                                userId:insertNewReferral._id,
                                myShare: commissionRate ? commissionRate.config_value: "0",
                                friendShare:"0",
                                referralCode:referralCode.code,
                                isDefault:true,
                            })
                            logger.info('ADD MY REFERRAL ',addMyReferral);
                            await addMyReferral.save();
                            const addMyIncome= new referralModel.referralIncome({
                                userId: checkReferralCode._id,
                                amount: 0,
                                refereeCode:referralCode.code,
                                nftId: -1,
                                recievedFrom: insertNewReferral._id,
                            });
                            
                            logger.info('ADD MY INCOME ',addMyIncome);
                            await addMyIncome.save();
                
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
                                    const sysMsg = await getSystemMessage('GPAY_00006_VERIFY_EMAIL')
                                    res.status(201).json({
                                        msg: sysMsg ? sysMsg.message : 'Success! Please check your email to verify account',
                                        status:201
                                    })
                                } else {                                    
                                    const sysMsg = await getSystemMessage('GPAY_00027_SOMETHING_WRONG')
                                    res.json({
                                        status: 400,
                                        msg: sysMsg ? sysMsg.message : 'Something went Wrong',
                                    })
                                }
                            } else {
                                const sysMsg = await getSystemMessage('GPAY_00027_SOMETHING_WRONG')
                                res.json({
                                    status: 400,
                                    msg: sysMsg ? sysMsg.message : 'Something went Wrong',
                                })
                            }
                        } else {
                            const sysMsg = await getSystemMessage('GPAY_00028_USER_NOT_CREATED_TRY_AGAIN')
                            res.json({
                                status: 400,
                                msg: sysMsg ? sysMsg.message : 'User not created. Please try again',
                            })
                        }
                    } else {
                        const sysMsg = await getSystemMessage('GPAY_00029_INVAILD_REFERRAL_CODE')
                        res.json({
                            status: 400,
                            msg: sysMsg ? sysMsg.message : 'Invalid referral code',
                        })
                    }
                } else {
                    const verificationToken = crypto
                        .randomBytes(40)
                        .toString('hex')
                    let hashedPassword = CryptoJS.AES.encrypt(
                        req.body.password,
                        process.env.PASS_SEC
                    ).toString()
                    if(req.body.metamaskKey) {
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
                            refereeCode: refereeCode,
                        }
                    }
                    else {
                        query = {
                            username: req.body.username,
                            email: req.body.email,
                            password: hashedPassword,
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
                            refereeCode: refereeCode,
                        }
                    }
                    const newUser = new models.users(query)
                    const insertNewReferral = await newUser.save()
                    if (insertNewReferral) {
                        const newUserInfo = await models.users.findById(
                            insertNewReferral._id
                        )
                        const addMyReferral = new referralModel.referralDetails({
                            userId:insertNewReferral._id,
                            myShare: commissionRate ? commissionRate.config_value: "0",
                            friendShare:"0",
                            referralCode:referralCode.code,
                            isDefault:true,
                        })
                        logger.info('ADD MY REFERRAL ',addMyReferral);
                        await addMyReferral.save();
                        sendVerificationEmail({
                            name: newUserInfo.username,
                            email: newUserInfo.email,
                            verificationToken: newUserInfo.verificationToken,
                            origin: process.env.APP_BACKEND_URL,
                        })
                        if (newUserInfo) {
                            const sysMsg = await getSystemMessage('GPAY_00006_VERIFY_EMAIL')
                            res.status(201).json({
                                msg: sysMsg ? sysMsg.message : 'Success! Please check your email to verify account',
                                status:201
                            })
                        } else {
                            const sysMsg = await getSystemMessage('GPAY_00027_SOMETHING_WRONG')
                            res.json({
                                status: 400,
                                msg: sysMsg ? sysMsg.message : 'Something went Wrong',
                            })
                        }
                    } else {
                        const sysMsg = await getSystemMessage('GPAY_00028_USER_NOT_CREATED_TRY_AGAIN')
                        res.json({
                            status: 400,
                            msg: sysMsg ? sysMsg.message : 'User not created. Please try again',
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

        // const getNewReferralCode = await models.users.findOne({
        //     referralCode: newCode,
        // })
        // if (getNewReferralCode) {
        //     getReferralCode()
        // } else {
            resolve({ code: newCode })
        // }
    })
}

const getAllMyReferrals = async function (req, res) {
    try {
        let page = req.params.page;
        let pageSize = req.params.pageSize;
        let total = 0;
        const getMyRefer = await referralModel.referralDetails.find(
            { userId: req.body.userId },
        )
        let referIds = [];
        for (let i = 0; i < getMyRefer.length; i++) {
            referIds.push(getMyRefer[i]._id)
        }
        const getMyReferralsId = await referralModel.myReferral.find(
            { referredBy: { $in: referIds } },
            { _id: 0, userId: 1 }
        )
        let Ids = []
        for (let i = 0; i < getMyReferralsId.length; i++) {
            Ids.push(getMyReferralsId[i].userId)
        }
        logger.info(Ids)

        if (getMyReferralsId.length) {
            total = await models.users.find({_id:{$in:Ids}}).count()
            const getMyReferrals = await models.users.find(
                { _id: { $in: Ids },  },
                {
                    "_id": 1,
                    "email": 1,
                    "refereeCode":1,
                    "createdAt":1
                },
                { __v: 0 }
            ).limit(pageSize).skip(pageSize * page);
            if (getMyReferrals) {
                const sysMsg = await getSystemMessage('GPAY_00030_SUCCESS')
                res.json({
                    status: 200,
                    msg: sysMsg ? sysMsg.message : 'Success',
                    data: getMyReferrals,
                    page:page,
                    pageSize:pageSize,
                    total:total
                })
            } else {
                const sysMsg = await getSystemMessage('GPAY_00027_SOMETHING_WRONG')
                res.json({
                    status: 400,
                    msg: sysMsg ? sysMsg.message : 'Something went wrong',
                    data: {},
                })
            }
        } else {            
            const sysMsg = await getSystemMessage('GPAY_00031_NO_REFERRALS')
            res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'No Referrals Found', data:[] })
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const getAllSuperAdmin = async function (req, res) {
    try {
        const superAdmin = await models.users.find({ isSuperAdmin: true })

        if (superAdmin && superAdmin.length) {
            const sysMsg = await getSystemMessage('GPAY_00030_SUCCESS')
            res.json({ status: 200, msg: sysMsg ? sysMsg.message : 'Success', data: superAdmin })
        } else {
            const sysMsg = await getSystemMessage('GPAY_00032_NO_SUPER_USER')
            res.json({ status: 200, msg: sysMsg ? sysMsg.message : 'No SuperUser Found' })
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const getAllAdmin = async function (req, res) {
    try {
        const admin = await models.users.find({ isAdmin: true })

        if (admin && admin.length) {
            const sysMsg = await getSystemMessage('GPAY_00030_SUCCESS')
            res.json({ status: 200, msg: sysMsg ? sysMsg.message : 'Success', data: admin })
        } else {
            const sysMsg = await getSystemMessage('GPAY_00032_NO_SUPER_USER')
            res.json({ status: 200, msg: sysMsg ? sysMsg.message : 'No SuperUser Found' })
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const changeUserStatus = async function (req, res) {
    let userId
    if (req.body.email) {
        const userData = await models.users.findOne({
            email: { $regex: new RegExp(req.body.email, 'i') },
        })
        if (userData) {
            userId = userData._id
        } else {            
            const sysMsg = await getSystemMessage('GPAY_00033_USER_NOT_FOUND')
            res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'User not found' })
            return
        }
    } else if (req.body.walletAddr) {
        const userData = await models.users.findOne({
            metamaskKey: req.body.walletAddr,
        })
        if (userData) {
            userId = userData._id
        } else {
            const sysMsg = await getSystemMessage('GPAY_00033_USER_NOT_FOUND')
            res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'User not found' })
            return
        }
    }
    try {
        if (req.body.status == undefined || req.body.status == 0) {
            const sysMsg = await getSystemMessage('GPAY_00034_STATUS_REQUIRED')
            res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'status is required' })
            return
        }

        if (userId == undefined || userId == '') {
            const sysMsg = await getSystemMessage('GPAY_00039_USER_ID_REQUIRED')
            res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'userId is required' })
            return
        }

        // Status -> 11 [Add Admin]
        // Status -> 12 [Delete Admin]
        // Status -> 21 [Add Super Admin]
        // Status -> 22 [Delete Super Admin]
        const userInfo = await models.users.find({ _id: userId })
        logger.info(userInfo)

        if (userInfo && userInfo.length) {
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
                    const sysMsg = await getSystemMessage('GPAY_00030_SUCCESS')
                    res.json({
                        status: 200,
                        msg: sysMsg ? sysMsg.message : 'Success',
                        data: makeAdmin,
                    })

                    return
                } catch (err) {
                    logger.info(err)
                    const sysMsg = await getSystemMessage('GPAY_00027_SOMETHING_WRONG')
                    res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'Something went wrong' })
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
                    const sysMsg = await getSystemMessage('GPAY_00030_SUCCESS')
                    res.json({
                        status: 200,
                        msg: sysMsg ? sysMsg.message : 'Success',
                        data: makeSuperAdmin,
                    })

                    return
                } catch (err) {
                    logger.info(err)
                    const sysMsg = await getSystemMessage('GPAY_00027_SOMETHING_WRONG')
                    res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'Something went wrong' })
                    return
                }
            }
        } else {
            const sysMsg = await getSystemMessage('GPAY_00033_USER_NOT_FOUND')
            res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'User not found' })
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
            const sysMsg = await getSystemMessage('GPAY_00034_STATUS_REQUIRED')
            res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'status is required' })
            return
        }
        if (walletAddress == undefined || walletAddress == '') {
            const sysMsg = await getSystemMessage('GPAY_00035_WALLET_ADDRESS_REQUIRED')
            res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'walletAddress is required' })
            return
        }

        const userInfo = await models.users.find({ _id: userId })

        if (userInfo !== undefined || userInfo !== '') {
            if (userInfo[0] && userInfo[0].metamaskKey && userInfo[0].metamaskKey.length == 6) {
                const sysMsg = await getSystemMessage('GPAY_00036_WALLET_LIMIT_EXCEED')
                res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'wallet limit exceed' })
                return
            }

            if (userInfo[0] && userInfo[0].metamaskKey && userInfo[0].metamaskKey.includes(req.body.walletAddress)) {
                const sysMsg = await getSystemMessage('GPAY_00037_USER_EXISTS_FOR_WALLET')
                res.json({
                    status: 400,
                    msg: sysMsg ? sysMsg.message : 'User already exists with this wallet',
                })
                return
            }

            const walletInfo = await models.users.find({
                metamaskKey: { $in: [req.body.walletAddress] },
            })

            if (walletInfo && walletInfo.length) {
                const sysMsg = await getSystemMessage('GPAY_00038_WALLET_ADDRESS_USED')
                res.json({
                    status: 400,
                    msg: sysMsg ? sysMsg.message : 'Wallet Address id already used by other email',
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
            const userDataUpdated = await models.users.findOne({_id:req.body.userId})
            logger.info('updated user ',userDataUpdated);
            const sysMsg = await getSystemMessage('GPAY_00030_SUCCESS')
            res.json({
                status: 200,
                msg: sysMsg ? sysMsg.message : 'Success',
                data: userDataUpdated,
            })

            return
        } else {
            const sysMsg = await getSystemMessage('GPAY_00014_INVALID_CREDENTIALS')
            res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'Invalid Credentials!' })
        }
    } catch (error) {
        logger.info(error)
        res.json({ status: 400, msg: error.toString() })
    }
}

const removeWalletKey = async function (req, res) {
    try {
        if (req.user.userId == undefined || req.user.userId == '') {
            const sysMsg = await getSystemMessage('GPAY_00039_USER_ID_REQUIRED')
            res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'UserId is required' })
            return
        }

        if (
            req.body.walletAddress == undefined ||
            req.body.walletAddress == ''
        ) {
            const sysMsg = await getSystemMessage('GPAY_00040_WALLET_KEY_REQUIRED')
            res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'walletKey is required' })
            return
        }

        const userInfo = await models.users.findOne({
            _id: req.user.userId,
            metamaskKey: req.body.walletAddress,
        })

        if (userInfo) {
            const updateUserInfo = await models.users.updateOne(
                { _id: req.user.userId },
                { $pull: { metamaskKey: req.body.walletAddress } }
            )

            if (updateUserInfo.modifiedCount > 0) {
                const userDataUpdated = await models.users.findOne({_id:req.user.userId})
                const sysMsg = await getSystemMessage('GPAY_00041_WALLET_REMOVED')
                res.json({
                    status: 200,
                    msg: sysMsg ? sysMsg.message : 'Wallet Removed',
                    info: updateUserInfo,
                    data:userDataUpdated
                })
            } else {
                const sysMsg = await getSystemMessage('GPAY_00042_WALLET_NOT_REMOVED')
                res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'Wallet Not Removed' })
            }
        } else {
            const sysMsg = await getSystemMessage('GPAY_00043_USER_NOT_FOUND')
            res.json({ status: 400, msg: sysMsg ? sysMsg.message : 'user not found' })
        }
    } catch (error) {
        res.json({ status: 400, msg: error.toString() })
    }
}

const getAllWallet = async function (req, res) {
    try {
        if (req.body.userId == undefined || req.body.userId == '') {
            const sysMsg = await getSystemMessage('GPAY_00039_USER_ID_REQUIRED')
            res.status(400).json({ status: 400, msg: sysMsg ? sysMsg.message : 'userId is required' })
            return
        }

        const walletInfo = await models.users.find(
            { _id: req.body.userId },
            { metamaskKey: 1 }
        )

        if (walletInfo && walletInfo.length) {
            const sysMsg = await getSystemMessage('GPAY_00030_SUCCESS')
            res.status(200).json({ status: 200, msg: sysMsg ? sysMsg.message : 'Success', data: walletInfo })
        } else {
            const sysMsg = await getSystemMessage('GPAY_00044_NO_WALLETS')
            res.status(400).json({ sttaus: 400, msg: sysMsg ? sysMsg.message : 'No Wallets found' })
        }
    } catch (error) {
        res.status(400).json({ status: 400, msg: eror.toString() })
    }
}

const checkRegisterredWallet = async (req, res) => {
    try {
        const walletAddress = req.body.walletAddress
        if (walletAddress == undefined || walletAddress == '') {
            const sysMsg = await getSystemMessage('GPAY_00045_WALLET_ADDRESS_REQUIRED')
            res.status(400).json({ status: 400, msg: sysMsg ? sysMsg.message : 'Wallet Address is required' })
            return
        }
        const userInfo = await models.users.findOne({
            metamaskKey: walletAddress[0],
        })
        logger.info(userInfo, walletAddress);
        if(!userInfo) {
            const sysMsg = await getSystemMessage('GPAY_00046_USER_NOT_REGISTERED')
            return res.status(404).json({ status: 404, err: sysMsg ? sysMsg.message : 'User not Registered!' })
        }
        if(!userInfo?.isVerified) {
            const sysMsg = await getSystemMessage('GPAY_00047_VERIFY_EMAIL')
            return res.status(400).json({
                err: sysMsg ? sysMsg.message : 'Please verify your email first!'
            })
        }
        if (userInfo && userInfo !== null) {
            logger.info('A ',userInfo);
            const sysMsg = await getSystemMessage('GPAY_00030_SUCCESS')
            res.status(200).json({
                status: 200,
                msg: sysMsg ? sysMsg.message : 'Success',
                data: userInfo,
            })
            return
        } else {
            const sysMsg = await getSystemMessage('GPAY_00046_USER_NOT_REGISTERED')
            res.status(400).json({ status: 400, msg: sysMsg ? sysMsg.message : 'User not Registered!' })
        }
    } catch (error) {
        logger.info(error)
        const sysMsg = await getSystemMessage('GPAY_00048_SERVER_ERROR')
        res.status(500).json({ status: 500, err: sysMsg ? sysMsg.message : '500: Internal Server Error' })
    }
}

const checkWalletKey = async function (req, res) {
    try {
        if (req.body.userId == undefined || req.body.userId == '') {
            const sysMsg = await getSystemMessage('GPAY_00039_USER_ID_REQUIRED')
            res.status(400).json({ status: 400, msg: sysMsg ? sysMsg.message : 'userId is required' })
            return
        }

        if (
            req.body.walletAddress == undefined ||
            req.body.walletAddress == ''
        ) {
            const sysMsg = await getSystemMessage('GPAY_00040_WALLET_KEY_REQUIRED')
            res.status(400).json({ status: 400, msg: sysMsg ? sysMsg.message : 'walletKey is required' })
            return
        }

        const walletInfo = await models.users.find({
            _id: req.body.userId,
        })
        logger.info('l',req.body.walletAddress)
        logger.info('k',walletInfo)

        if (walletInfo && walletInfo.length > 0 && walletInfo.includes(req.body.walletAddress)) {
            logger.info(walletInfo);
            const sysMsg = await getSystemMessage('GPAY_00030_SUCCESS')
            res
            .status(200)
            .json(
                { status: 200, msg: sysMsg ? sysMsg.message : 'Success', exists:true, data: walletInfo[0] })
        } else {
            const sysMsg = await getSystemMessage('GPAY_00049_WALLET_NOT_FOUND')
            res.status(200).json({ status: 200, msg: sysMsg ? sysMsg.message : 'Wallet not found', exists:false })
        }
    } catch (error) {
        const sysMsg = await getSystemMessage('GPAY_00048_SERVER_ERROR')
        res.status(400).json({ status: 400, msg: sysMsg ? sysMsg.message : 'Internal Server Error!' })
    }
}

const getPercent = async function (req, res) {
    try {
        const setting = await referralModel.appsetting.find({})
        const sysMsg = await getSystemMessage('GPAY_00030_SUCCESS')
        res.status(200).json({ status: 200, msg: sysMsg ? sysMsg.message : 'Success', data: setting })
    } catch (error) {
        res.status(400).json({ status: 400, msg: error.toString() })
    }
}

const setactivity = async function (req, res) {
    const { activity, timestamp } = req.body
    await models.users.updateOne(
        { _id: req.body.userId },
        { $push: { activity: { activity: activity, timestamp: timestamp } } },
        { new: true, upsert: true }
    )
    const sysMsg = await getSystemMessage('GPAY_00050_DONE')
    res.status(200).json(sysMsg ? sysMsg.message : 'Done')
}

const getactivity = async function (req, res) {
    if (Object.keys(req.params).length !== 0) {
      logger.info("user id ", req.body.userId);
      const user = await models.users.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(req.body.userId) } },
        { $project: { count: { $size: "$activity" } } },
      ]);
      const userActivity = await models.users
        .findOne({ _id: req.body.userId })
        .slice("activity", [
          parseInt(req.params.pageSize) * (req.params.page - 1),
          parseInt(req.params.pageSize),
        ]);
      res.json({ userActivity: userActivity?.activity, total: user[0]?.count });
    } else {
      const userActivity = await models.users.findOne({ _id: req.body.userId });
      res.json({ userActivity: userActivity?.activity });
    }
}

const updatePresaleLaunchPad = async function (req, res) {
    try {
        if (req.body.userId == undefined || req.body.userId == '') {
            const sysMsg = await getSystemMessage('GPAY_00039_USER_ID_REQUIRED')
            res.status(400).json({ status: 400, msg: sysMsg ? sysMsg.message : 'userId is required' })
            return
        }

        if (req.body.presale == undefined) {
            const sysMsg = await getSystemMessage('GPAY_00051_PRESALE_REQUIRED')
            res.status(400).json({ status: 400, msg: sysMsg ? sysMsg.message : 'presale is required' })
            return
        }

        if (req.body.launchpad == undefined) {
            const sysMsg = await getSystemMessage('GPAY_00051_LAUNCHPAD_REQUIRED')
            res.status(400).json({ status: 400, msg: sysMsg ? sysMsg.message : 'launchpad is required' })
            return
        }

        const userInfo = await models.users.find({
            _id: req.body.userId,
            isSuperAdmin: true,
        })
        if (userInfo) {
            const setting = await referralModel.appsetting.updateOne({
                launchpad: req.body.launchpad,
                presale: req.body.presale,
                popup: req.body.popup,
                popupAlertText: req.body.popupAlertText,
            })
            logger.info(setting, 'setting')
            
            const newSetting = await referralModel.appsetting.find({})
            const sysMsg = await getSystemMessage('GPAY_00030_SUCCESS')
            res.status(200).json({ status: 200, msg: sysMsg ? sysMsg.message : 'Success', data: newSetting })
        } else {
            const sysMsg = await getSystemMessage('GPAY_00052_ACTION_NOT_PERMITTED')
            res.status(400).json({ status: 400, msg: sysMsg ? sysMsg.message : 'Action Not Permitted' })
        }
    } catch (error) {
        res.status(400).json({ status: 400, msg: error.toString() })
    }
}


const updateActivity = async function(req,res) {
    const ud = await models.users.updateOne(
        {
            _id: req.user.userId,
            "activity.orderId": req.body.orderId,
        },
        { $set: { "activity.$.activity": req.body.dataString } }
    );
    const sysMsg = await getSystemMessage('GPAY_00050_DONE')
    console.log("UD ",ud);
    res.status(200).json(sysMsg ? sysMsg.message : 'Done')
}

const updatePercent = async function (req, res) {
    try {
        logger.info('kfjjkdsngfjkdshfk')
        if (req.body.userId == undefined || req.body.userId == '') {
            const sysMsg = await getSystemMessage('GPAY_00039_USER_ID_REQUIRED')
            res.status(400).json({ status: 400, msg: sysMsg ? sysMsg.message : 'userId is required' })
            return
        }

        if (req.body.percent == undefined || req.body.percent == '') {
            const sysMsg = await getSystemMessage('GPAY_00051_PERCENT_REQUIRED')
            res.status(400).json({ status: 400, msg: sysMsg ? sysMsg.message : 'Percent is required' })
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
            logger.info(setting, 'setting')
            if(setting.modifiedCount === 0){
                await referralModel.appsetting.create({referralPercent: req.body.percent,})
                setting.modifiedCount = 1
                logger.info('created settings')
            }
            if (setting.modifiedCount > 0) {
                const newSetting = await referralModel.appsetting.find({})
                const sysMsg = await getSystemMessage('GPAY_00030_SUCCESS')
                res.status(200).json({ status: 200, msg: sysMsg ? sysMsg.message : 'Success', data: newSetting })
            } else {
                const sysMsg = await getSystemMessage('GPAY_00027_SOMETHING_WRONG')
                res.status(400).json({ status: 400, msg: sysMsg ? sysMsg.message : 'Something went Wrong' })
            }
        } else {
            const sysMsg = await getSystemMessage('GPAY_00052_ACTION_NOT_PERMITTED')
            res.status(400).json({ status: 400, msg: sysMsg ? sysMsg.message : 'Action Not Permitted' })
        }
    } catch (error) {
        res.status(400).json({ status: 400, msg: error.toString() })
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
    updatePresaleLaunchPad,
    setactivity,
    getactivity,
    updateActivity
}
