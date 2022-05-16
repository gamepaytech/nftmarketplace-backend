const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const influencerSchema = new Schema({

    userId: {type: String, required: true},
    userName: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    businessName: {type: String},
    businessAddress: {type: String},
    businessPhoneNumber: {type: String},
    businessEmail: {type: String},
    facebook: {type: String},
    instagram: {type: String},
    twitter: {type: String},
    youtube: {type: String},
    telegram: {type: String},
    discord: {type: String},
    tikTok: {type: String}


});

module.exports = mongoose.model('Influencer', influencerSchema);