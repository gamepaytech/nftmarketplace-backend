const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SystemMessagesSchema = new Schema(
    {
        language: { type: String, required: true },
        msg_code: { type: String, required: true },
        message: { type: String, required: true },
        module: { type: String, required: true }
    },
    { timestamps: true }
)

const SystemMessages = mongoose.model('SystemMessages', SystemMessagesSchema)

SystemMessages.countDocuments({}, function (err, count) {
    if (err){
        console.log('err',err)
    }else{
        console.log('Count :', count)
        if(count === 0){
            console.log('Inserting documents into System Messages')
            SystemMessages.insertMany([
                { language : 'us_en', msg_code : 'GPAY_00001_EMAIL_REQUIRED', message : 'Please provide an email', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00002_USERNAME_REQUIRED', message : 'Please provide the username', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00003_PASSWORD_REQUIRED', message : 'Please provide the password', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00004_PASSWORD_MISMATCH', message : 'Passwords  do not match', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00005_EMAIL_USERNAME_EXISTS', message : 'Email or username already exists', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00006_VERIFY_EMAIL', message : 'Success! Please check your email to verify account', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00007_VERIFY_EMAIL_AT', message : 'Please verify your Email Address ', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00008_WALLET_ADDRESS_NOT_REGISTERED', message : 'Wallet Address Not Registered', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00009_ENTER_PASSWORD', message : 'Please enter the password', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00010_USER_NOT_EXISTS', message : 'User does not exist', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00011_WRONG_PASSWORD', message : 'Wrong Password!!', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00012_VERIFY_EMAIL', message : 'Please verify your email', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00013_USER_LOGGED_OUT', message : 'User logged out!', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00014_INVALID_CREDENTIALS', message : 'Invalid Credentials!', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00015_INVALID_EMAIL_OR_PASSWORD', message : 'Invalid email or password!', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00016_USER_ALREADY_VERIFIED', message : 'User already verified', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00017_INVALID_TOKEN', message : 'Invalid verification token', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00018_EMAIL_VERIFIED', message : 'Email Successfully Verified', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00019_INVAILD_REQUEST', message : 'Invalid Request', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00020_VAILD_EMAIL', message : 'Please provide valid email', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00021_CHECK_EMAIL_RESET_LINK', message : 'Please check your email for reset password link', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00022_INVALID_USER', message : 'Invalid User', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00023_TOKEN_REQUIRED', message : 'Please provide the token', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00024_INVALID_TOKEN', message : 'Invalid Token', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00025_PASSWORD_UPDATED', message : 'Password has been successfully updated', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00026_EMAIL_USERNAME_IN_USE', message : 'Email or Username already in use', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00027_SOMETHING_WRONG', message : 'Something went wrong', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00028_USER_NOT_CREATED_TRY_AGAIN', message : 'User not created. Please try again', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00029_INVAILD_REFERRAL_CODE', message : 'Invalid referral code', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00030_SUCCESS', message : 'Success', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00031_NO_REFERRALS', message : 'No Referrals Found', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00032_NO_SUPER_USER', message : 'No SuperUser Found', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00033_USER_NOT_FOUND', message : 'User not found', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00034_STATUS_REQUIRED', message : 'status is required', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00035_WALLET_ADDRESS_REQUIRED', message : 'walletAddress is required', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00036_WALLET_LIMIT_EXCEED', message : 'wallet limit exceed', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00037_USER_EXISTS_FOR_WALLET', message : 'User already exists with this wallet', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00038_WALLET_ADDRESS_USED', message : 'Wallet Address id already used by other email', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00039_USER_ID_REQUIRED', message : 'userId is required', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00040_WALLET_KEY_REQUIRED', message : 'walletKey is required', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00041_WALLET_REMOVED', message : 'Wallet Removed', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00042_WALLET_NOT_REMOVED', message : 'Wallet Not Removed', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00043_USER_NOT_FOUND', message : 'user not found', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00044_NO_WALLETS', message : 'No Wallets found', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00045_WALLET_ADDRESS_REQUIRED', message : 'Wallet Address is required', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00046_USER_NOT_REGISTERED', message : 'User not Registered!', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00047_VERIFY_EMAIL', message : 'Please verify your email first!', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00048_SERVER_ERROR', message : '500: Internal Server Error', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00049_WALLET_NOT_FOUND', message : 'Wallet not found', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00050_DONE', message : 'Done', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00051_PERCENT_REQUIRED', message : 'Percent is required', module : 'auth'},
                { language : 'us_en', msg_code : 'GPAY_00052_ACTION_NOT_PERMITTED', message : 'Action Not Permitted', module : 'auth'},
            ])
        }
    }
});
module.exports = SystemMessages
