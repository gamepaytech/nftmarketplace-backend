const sendEmail = require("./sendEmail");

const sendSubmitEmail = async ({
  emailId, userName
}) => {
  return sendEmail({
    to: emailId,
    subject: "Gamepay - Your Application is Sucessfully Submitted",
    html: `
    <!DOCTYPE html>
    <html lang="en">
       <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0 " />
          <meta name="format-detection" content="telephone=no" />
          <meta name="color-scheme" content="light">
          <meta name="supported-color-schemes" content="light">
          <title> Welcome to Chickey Chik’s</title>
          <link rel="icon" type="image/png" sizes="96x96" href="https://gamepay.sg/assets/images/favicon-96x96.png">
          <style>
             body {
             margin: 0;
             }
             @media only screen and (max-width: 480px) {
             .main-table {width:650px!important; padding:0;}
             }
          </style>
       </head>
       <body>
          <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" style="border-left: 1px solid #e9eff5;
             border-right: 1px solid #e9eff5;border-bottom: 1px solid #e9eff5;" bgcolor="#e9eff5">
          <tr>
             <td>
                <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" class="main-table darkcolor" style="background-color: #ffffff;">
                   <tr>
                      <td style="text-align: center;border-bottom: 1px solid #e9eff5;">
                         <img style="display:block;width:650px;" src="https://s3.ap-southeast-1.amazonaws.com/newsletter.gamepay.sg/game-paylogo.png" alt="Gameplay-Logo" />
                      </td>
                   </tr>
                </table>
             </td>
          </tr>
          <tr>
             <td align="center" valign="top" bgcolor="#ffffff" style="background-color: #ffffff;">
                <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" class="main-table darkcolor">
                   <tr>
                      <td>
                         <table align="center" width="550"  cellspacing="0" cellpadding="0" style="padding-top: 0px;">
                            <tr style="display: block;">
                               <td style="padding-top: 50px;">
                                  <table align="center"  cellspacing="0" cellpadding="0">
                                     <tr>
                                        <td valign="top" style="width:100%;text-align: center;" width="480">
                                           <table align="center">
                                              <tr>
                                                 <td style="padding-left: 35px;padding-right:35px;padding-bottom: 40px;">
                                                    <p style="font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;text-align:center;
                                                       color:#5c5c5c;margin-top:10px;margin-bottom: 0px; line-height: 22px;">
                                                             Dear ${userName},
                                                             Thank you for submitting the game to Gamepay.
                                                             We would like to inform you that we have received your completed information about your game. Our technical team is currently reviewing the details and reach out to you soon in the next 3-5 business working days. 
                                                             Thank you again for taking the time to collaborate with Gamepay by filling out the form.
                                                    </p>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </table>
                               </td>
                            </tr>
                         </table>
                      </td>
                   </tr>
                </table>
             </td>
          </tr>
          <tr>
             <td align="center" valign="top" style="background-color: #f5f5f5;">
                <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5" class="main-table">
                   <tr>
                      <td>
                         <table align="center" width="550" valign="center" cellspacing="0" cellpadding="0">
                            <tr>
                               <td style="padding-bottom: 30px; padding-top: 50px; text-align: center;">
                                  <table align="center" width="500" valign="center" cellspacing="0" cellpadding="0">
                                     <tr>
                                        <td style="padding-top: 10px;">
                                           <h2 style="font-family:Arial, Helvetica, sans-serif;margin: 0; text-align:center;font-size:25px;font-weight:bold;color: #030626;"> Connect with us and get your daily<br/> dose
                                              of updates.
                                           </h2>
                                        </td>
                                     </tr>
                                     <tr>
                                        <td style="padding-bottom: 0px;padding-top: 25px; text-align: center;">
                                           <table align="center" valign="center" cellspacing="0" cellpadding="0" width="480" style="margin-top:0px;">
                                              <tr>
                                                 <table align="center" width="480" valign="center" cellspacing="0" cellpadding="0" style="margin-top: 0px; margin-bottom:0px;">
                                                    <tr>
                                                       <td style="padding-top: 0px; padding-bottom: 25px;">
                                                          <table align="center" valign="center" cellspacing="0" cellpadding="0" width="320">
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
                                                 </table>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </table>
                               </td>
                            </tr>
                         </table>
                      </td>
                   </tr>
                   <tr>
                      <td>
                         <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" class="main-table">
                            <tr>
                               <td style="padding-top: 30px;padding-bottom: 30px;">
                                  <p style="font-family:Arial, Helvetica, sans-serif ;font-size:16px;font-weight:400;color:#5c5c5c;margin: 0; text-align: center;">@2022 Chickeychik, All rights reserved </p>
                               </td>
                            </tr>
                         </table>
                      </td>
                   </tr>
                </table>
       </body>
    </html>
        `,
  });
};

module.exports = sendSubmitEmail;
