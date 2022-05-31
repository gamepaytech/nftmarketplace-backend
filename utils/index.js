const { createJWT, isTokenValid, createLimitedTimeToken } = require('./jwt')
const {
    createTokenPayload,
    createWalletAddressPayload,
} = require('./createTokenPayload')
const sendVerificationEmail = require('./sendVerificationEmail')
const sendResetPassswordEmail = require('./sendResetPassswordEmail')
const createHash = require('./createHash')
const { getSystemMessage,  
    getSystemMessageByLang
} = require('./getSystemMessage')
const getSystemConfig = require('./getSystemConfiguration');
const getFeatureControl = require('./getFeatureControl');
const sendGridApi = require('./sendGrid');
module.exports = {
    createJWT,
    isTokenValid,
    createLimitedTimeToken,
    createTokenPayload,
    createWalletAddressPayload,
    sendResetPassswordEmail,
    sendVerificationEmail,
    createHash,
    getSystemMessage,
    getSystemMessageByLang,
    getSystemConfig,
    getFeatureControl,
    sendGridApi
}
