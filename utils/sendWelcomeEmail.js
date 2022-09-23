const sendEmail = require("./sendEmail");

const sendWelcomeEmail = async ({
  email
}) => {
  return sendEmail({
    to: email,
    subject: "You’re In. Welcome to Gamepay!",
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
      <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">
      Hello, and welcome to Gamepay's You’re In. Welcome to Gamepay!
      </span>
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
                                             <td>
                                                <h1 style="font-family:Arial, Helvetica, sans-serif;margin: 0; text-align:center;font-size:30px;font-weight:bold;color: #030627;line-height: 33px;">Hello there,</h1>
                                             </td>
                                          </tr>
                                          <tr>
                                             <td style="padding-top:30px;padding-bottom:30px;">
                                                <img style="display:block;width:650px;" src="https://s3.ap-southeast-1.amazonaws.com/gamepay.sg/assets/images/welcome-email-image.jpg" alt="GamepayLogo">
                                             </td>
                                          </tr>
                                          <tr>
                                             <td>
                                                <h1 style="font-family:Arial, Helvetica, sans-serif;margin: 0; text-align:center;font-size:30px;font-weight:bold;color: #030627;line-height: 33px;">We are so glad you have<br/>
                                                   registered with us. 
                                                </h1>
                                                <p style="width: 50px;height: 3px;text-align: center;background: #00dcff;display: block;margin: 15px auto;"></p>
                                             </td>
                                          </tr>
                                          <tr>
                                             <td style="padding-left: 35px;padding-right:35px;padding-bottom: 40px;">
                                                <p style="font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;text-align:center;
                                                   color:#5c5c5c;margin-top:10px;margin-bottom: 0px; line-height: 22px;">
                                                   <strong>“We are the Uber-like on-demand solution for gamers to choose the most 
                                                   profitable game with immersive gameplay”</strong>
                                                </p>
                                                <p style="font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;text-align:center;
                                                   color:#5c5c5c;margin-top:10px;margin-bottom: 0px; line-height: 22px;">
                                                   We are introducing NFT Swapping in our platform, which can be beneficial for 
                                                   players to easily switch from one game to another without having to leave or 
                                                   move their wallet to another chain.
                                                </p>
                                                <p style="font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;text-align:center;
                                                   color:#5c5c5c;margin-top:20px;margin-bottom: 0px; line-height: 22px;">
                                                   We connect the Web 3.0 ecosystem of Games, NFTs, Tokens, and Communities 
                                                   with Gamers, Guilds, and Gaming Companies enabling interoperability in the 
                                                   Metaverse.
                                                <p style="font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;text-align:center;
                                                   color:#5c5c5c;margin-top:20px;margin-bottom: 0px; line-height: 22px;">
                                                   Our <strong>platform</strong> has multi-language compatibility, allows credit/debit card payment,
                                                    an automated guild system, a functional marketplace, in-house DEX for liquidity,
                                                     an ROI calculator for users, and so on.
                                                   </p>
                                                <p style="font-family:Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;text-align:center;
                                                   color:#5c5c5c;margin-top:20px;margin-bottom: 0px; line-height: 22px;">
                                                   As a new member, we want to be sure that you are a part of our growing 
                                                   community and have access to the latest news and announcements.
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
                              <p style="font-family:Arial, Helvetica, sans-serif ;font-size:16px;font-weight:400;color:#5c5c5c;margin: 0; text-align: center;">@2022 Gamepay, All rights reserved </p>
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
  // console.log(`Send Email function Pending()`)
};

module.exports = sendWelcomeEmail;
