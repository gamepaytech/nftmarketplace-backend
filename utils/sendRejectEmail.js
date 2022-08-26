const sendEmail = require("./sendEmail");

const sendRejectEmail = async ({
  emailId
}) => {
  return sendEmail({
    to: emailId,
    subject: "Game ApprovalSatus",
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
      <title>Rejected Email</title>
      </head>
      <body>
      <h1>you are rejected </h1>
      </body>
</html>
        `,
  });
};

module.exports = sendRejectEmail;
