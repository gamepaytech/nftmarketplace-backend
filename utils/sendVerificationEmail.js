const sendEmail = require('./sendEmail')

const sendVerificationEmail = async ({
    name,
    email,
    verificationToken,
    origin,
}) => {
    const verifyEmail = `https://uatmarketplace.chickeychik.com/login/${verificationToken}/${email}`

    const message = `<p>Please confirm your email by clicking on the following link : 
    <a href="${verifyEmail}">Verify Email</a> </p>`

    // console.log(`Verify Message : ${message}`)
    // console.log(`Send Email function Start()`)
    return sendEmail({
        to: email,
        subject: 'Email Confirmation',
        html: `<h4> Hello ${name.charAt(0).toUpperCase() + name.slice(1)},</h4>
        ${message}
        `,
    })
    // console.log(`Send Email function Pending()`)
}

module.exports = sendVerificationEmail
