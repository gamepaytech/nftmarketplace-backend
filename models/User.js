const mongoose = require('mongoose')
const validator = require('validator')
 
const userSchema = mongoose.Schema(
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
        metamaskKey: { type: String },
        isAdmin: { type: Boolean, default: false },
        verificationToken: String,
        isVerified: {
            type: Boolean,
            default: false,
        },
        verifiedOn: Date,
        passwordToken: {
            type: String,
        },
        passwordTokenExpirationDate: {
            type: Date,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
