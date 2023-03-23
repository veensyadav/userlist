const sgMail = require("@sendgrid/mail");
const key = process.env.SENDGRID_KEY;

exports.alertMail = (emailAdd,
  name) => {
    sgMail.setApiKey(key);
    const msg = {
      to: emailAdd, // Change to your recipient
      from: "praveen01@yopmail.com", // Change to your verified sender
      cc: "akshay@yopmail.com",
      subject: "Alert Message",
      text: "and easy to do anywhere, even with Node.js",
      html: `
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Alert Message</title>
        </head>
        <body>
          <table style="max-width: 600px; margin: 0 auto; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f8f8; border: 1px solid #ebebeb;" cellspacing="0" borderspacing="0">
            <tr>
              <td style="padding: 15px;">
                <table style="text-align: center; border: 1px solid #ebebeb;">
                  <tr>
                    <td style="padding: 0 15px;">
                      <h3 style="font-size: 28px; margin: 35px 0 20px;">
                        User login succesfully
                      </h3>
                      <p style="font-size: 16px; line-height: 27px;">
                        It is an alert message to know that user ${name} having emailId ${emailAdd} login successfully,
                      </p>
                      <p style="font-size: 16px; line-height: 27px; margin: 30px 0 40px; text-align: left; border-top: 1px solid #ebebeb; padding-top: 15px;">
                        Thank you!
                      </p>
                    </td>
                  </tr>
                </table>   
              </td>
            </tr>
          </table>
        </body>
        </html>`,
    };
    sgMail
      .send(msg)
      .then(() => {
        // console.log('Email sent')
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
  };
