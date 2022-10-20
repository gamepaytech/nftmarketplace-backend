const { getSystemMessage } = require('./getSystemMessage')
const sendEmail = require('./sendEmail')

const sendVerificationEmailForUnVerified = async ({
    email,
    verificationToken
}) => {
    const verifyEmail = `${process.env.APP_FRONTEND_URL}/EmailVerification/${verificationToken}/${email}`
    const sysMsg = await getSystemMessage('GPAY_00054_EMAIL_MESSAGE_UNVERIFIED_USERS');
    const emailContent = sysMsg ? sysMsg.message : `We noticed that you have recently registered for a Gamepay account. You’re almost ready to get started. Please click on the link below to verify your account and enjoy exclusive gaming privileges with us. 

    If you have done already, kindly ignore this email. `;

    return sendEmail({
        to: email,
        subject: 'Verification for Gamepay registration',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0 " />
            <meta name="format-detection" content="telephone=no" />
            <title>Gamepay</title>
        </head>
        
        <body style="margin: 0;padding: 0;">
            <!-- <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">
                Hello, and welcome to 
                </span> -->
        
            <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" bgcolor="#141416">
                <tr>
                    <td valign="top" bgcolor="#141416" width="100%">
                        <table width="650" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td>
                                    <tr>
        
                                        <td style="padding-top: 30px;padding-bottom: 30px; text-align: center;border-bottom: 1px solid #333335;">
                                            <img src="https://s3.ap-southeast-1.amazonaws.com/newsletter.gamepay.sg/Feb2022/logo.png" alt="Gamepay-logo" />
                                        </td>
        
                                    </tr>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" bgcolor="#141416">
                        <tr>
                            <td style="padding-top: 50px;padding-bottom: 0px;">
                                <table width="650" align="center" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td>
                                            <table width="520" align="center" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
        
                                                    <td>
                                                        <h1 style="font-family:Arial, Helvetica, sans-serif;font-size:30px;font-weight:bold;
                                                    text-align:center;color:#00dcff;margin-top:0px;margin-bottom: 0;line-height: 22px;">Dear User </h1>
                                                        <p style="font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;
                                                          text-align:center;color:#ffffff;margin-top:20px;margin-bottom: 0;line-height: 22px;"> ${emailContent} <br><br><br> Please click on the below link to confirm your mail address.<br>
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-top: 25px;padding-bottom: 50px;">
                                                        <table align="center" valign="center">
                                                            <tr>
                                                                <td style="background-color: #00dcff;border-radius:30px">
                                                                    
                                                                    <a href="${verifyEmail}" style="font-family:Arial, Helvetica, sans-serif;border:solid 1px #00dcff;border-color:#00dcff; box-sizing:border-box;text-decoration:none;background-color:#00dcff;color:#141416;
                                                 font-size:16px;font-weight:400;margin:0;padding:10px 30px;display:inline-block;border-radius:30px" target="_blank">Confirm your email address</a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td valign="top" bgcolor="#0c0c0c" width="100%">
                                            <table width="650" align="center" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td>
                                                        <tr>
                                                            <table align="center" width="480" valign="center" cellspacing="0" cellpadding="0" style="margin-top: 0px; margin-bottom:0px;">
                                                                <tr>
                                                                    <td style="padding-top: 50px; padding-bottom: 25px;background-color: #0c0c0c;">
                                                                        <table align="center" valign="center" cellspacing="0" cellpadding="0" width="350">
                                                                            <tr>
                                                                                <td width="45">
                                                                                <a href="https://www.reddit.com/r/gamepayCommunity/" target="_blank"><img style="display:block;" src="https://www.chickeychik.com/notification-mail/colorupdate/redit.png" alt="Redit"></a>
                                                                                </td>
                                                                                <td width="45">
                                                                                    <a href="https://www.instagram.com/gamepayofficial/" target="_blank"><img style="display:block;" src="https://www.chickeychik.com/notification-mail/colorupdate/instagram.png" alt="Instagram"></a>
                                                                                </td>
                                                                                <td width="45">
                                                                                    <a href="https://www.pinterest.com/Gamepayofficial/" target="_blank"><img style="display:block;" src="https://www.chickeychik.com/notification-mail/colorupdate/pintrest.png" alt="pintrest"></a>
                                                                                </td>
                                                                                <td width="45">
                                                                                    <a href="https://www.facebook.com/Gamepayofficial" target="_blank"><img style="display:block;" src="https://www.chickeychik.com/notification-mail/colorupdate/facebook.png" alt="facebook"></a>
                                                                                </td>
                                                                                <td width="45">
                                                                                    <a href="https://vm.tiktok.com/TTPdkqefwv" target="_blank"><img style="display:block;" src="https://www.chickeychik.com/notification-mail/colorupdate/tiktok.png" alt="tiktok"></a>
                                                                                </td>
                                                                                <td width="45">
                                                                                    <a href="https://twitter.com/Gamepayofficial" target="_blank"><img style="display:block;" src="https://www.chickeychik.com/notification-mail/colorupdate/twitter.png" alt="twitter"></a>
                                                                                </td>
                                                                                <td width="45">
                                                                                    <a href="https://www.youtube.com/channel/UCN_LNU5EaXrrbzKKtDIKwiQ/" target="_blank"><img style="display:block;" src="https://www.chickeychik.com/notification-mail/colorupdate/youtube.png" alt="youtube"></a>
                                                                                </td>
                                                                                <td width="45">
                                                                                    <a href="https://t.me/gamepayofficialsg" target="_blank"><img style="display:block;" src="https://www.chickeychik.com/notification-mail/colorupdate/telegram.png" alt="telegram"></a>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <hr style="width: 250px;
                                                                            border-color: #4d4f66;
                                                                            margin-top: 20px;">
                                                                    </td>
                                                                </tr>
                                                                
                                                            </table>
                                                        </tr>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </tr>
                <tr>
                    <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" bgcolor="#e9eff5">
                        <tr>
                            <td style="padding-top: 30px;padding-bottom: 30px;">
                                <p style="font-family:Arial, Helvetica, sans-serif ;font-size:16px;font-weight:400;color:#030626;margin: 0; text-align: center;">@2022 Gamepay, All rights reserved </p>
                            </td>
                        </tr>
                    </table>
                </tr>
            </table>
        
        </body>
        
        </html>
        `
    })
}

module.exports = sendVerificationEmailForUnVerified
