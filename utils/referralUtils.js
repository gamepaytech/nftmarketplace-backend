
const models = require('../models/User')

const  getReferralCode = () => {
    return new Promise(async (resolve, reject) => {
        let newCode = ''
        const arr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        for (let i = 8; i > 0; i--) {
            newCode += arr[Math.floor(Math.random() * arr.length)]
        }
        resolve({ code: newCode })
    })
};

module.exports = { getReferralCode }
