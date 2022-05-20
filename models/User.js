const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: [true, 'username has already taken'],
        },
        email: {
            type: String,
            required: true,
            unique: [true, 'Email has already taken'],
            validate: {
                validator: validator.isEmail,
                message: 'Please provide valid email',
            },
        },
        password: { type: String, required: true },
        metamaskKey: { type: Array },
        isAdmin: { type: Boolean, default: false },
        isSuperAdmin: { type: Boolean, default: false },
        verificationToken: String,
        isVerified: {
            type: Boolean,
            default: false,
        },
        profilePic: {
            type: String,
            default: 'https://img.icons8.com/office/80/000000/test-account.png',
        },
        verifiedOn: Date,
        passwordToken: {
            type: String,
        },
        sourceName: {
            type: String,
            default: "",
        },
        passwordTokenExpirationDate: {
            type: Date,
        },
        referralCode: {
            type: String,
            required: true,
        },
        refereeCode: {
            type: String,
            required: false,
            default: '',
        },
        activity: {
            type: [],
        },
    },
    { timestamps: true }
)

module.exports = {
    users: mongoose.model('users', userSchema),
}
