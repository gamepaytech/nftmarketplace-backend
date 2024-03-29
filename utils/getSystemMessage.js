const SystemMessages = require('../models/SystemMessages')

const getSystemMessage = async (msgCode) => {
    console.log('Fetching error code for - ', msgCode)
    return await SystemMessages.findOne({
        language: 'us_en', // should be externalized
        msg_code: msgCode
    })
}

const getSystemMessageByLang = async (msgCode, lang) => {
    console.log('Fetching error code for - ', msgCode)
    return await SystemMessages.findOne({
        language: lang, // should be externalized
        msg_code: msgCode
    })
}

module.exports = {
    getSystemMessage,
    getSystemMessageByLang
}