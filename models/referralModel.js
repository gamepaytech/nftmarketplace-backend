const mongoose = require('mongoose')

let myReferral = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    referredBy: {
        type: String,
        required: true,
    },
    isDelete: {
        type: Number,
        default: 0,
    },
    createdDate: {
        type: Date,
        default: Date.now(),
    },
})

let myReferralIncome = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    recievedFrom: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        default: 0,
    },
    nftId: {
        type: String,
        default: '',
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now(),
    },
})

let appsetting = new mongoose.Schema({
    referralPercent:{
        type: Number,
        default: 5
    }
})

module.exports = {
    referralIncome: mongoose.model('referralIncome', myReferralIncome),
    myReferral: mongoose.model('myReferral', myReferral),
    appsetting: mongoose.model('appSetting', appsetting)
}
