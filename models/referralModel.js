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
    refereeCode: {
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

let myreferralDetails = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    referralCode: {
        type: String,
        required: true,
    },
    myShare: {
        type: String,
        required: true,
    },
    friendShare: {
        type: String,
        required: true,
    },
    note: {
        type: String,
    },
    isDefault:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        default:"active"
    },
    createdDate: {
        type: Date,
        default: Date.now(),
    },
})

myreferralDetails.virtual('myFreindReferral', {
    ref: 'myReferral', //The Model to use
    localField: '_id', //Find in Model, where localField 
    foreignField: 'referredBy', // is equal to foreignField
    count: true
});
// Set Object and Json property to true. Default is set to false
myreferralDetails.set('toObject', { virtuals: true });
myreferralDetails.set('toJSON', { virtuals: true });

let appsetting = new mongoose.Schema({
    referralPercent:{
        type: Number,
        default: 5
    },
    presale:{type: Boolean},
    launchpad:{type: Boolean}
})

module.exports = {
    referralIncome: mongoose.model('referralIncome', myReferralIncome),
    referralDetails: mongoose.model('referralDetails', myreferralDetails),
    myReferral: mongoose.model('myReferral', myReferral),
    appsetting: mongoose.model('appSetting', appsetting)
}
