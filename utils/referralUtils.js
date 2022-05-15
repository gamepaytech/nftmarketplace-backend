
const  getReferralCode = () => {
    return new Promise(async (resolve, reject) => {
        let newCode = ''
        const arr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        for (let i = 8; i > 0; i--) {
            newCode += arr[Math.floor(Math.random() * arr.length)]
        }

        // need to update the referral code logic in User collection
        const getNewReferralCode = await models.users.findOne({
            referralCode: newCode,
        });
        if (getNewReferralCode) {
            getReferralCode()
        } else {
            resolve({ code: newCode })
        }
    })
};

module.exports = { getReferralCode }