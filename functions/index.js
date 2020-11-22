const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = functions.config().sendgrid.key

sgMail.setApiKey(SENDGRID_API_KEY);
const sendM = (op, to) => {
    sgMail.send(op).then(() => console.log('Email sent', to)).catch(err => {
        console.error(err, op)
        if (err.response) {
            const { message, code, response } = err
            const { headers, body } = err
            console.error(body, to)
        }
        return null
    })
}

exports.sendMessageMail = functions.database.ref('messages/{pid}').onCreate((doc, context) => {
    const post = doc.val();
    let htmlTemp = (email) => `<html> <head> <style>*{padding: 0; margin: 0; box-sizing: border-box; text-decoration: none;}h2{color: #d20; margin-bottom: 12px; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif; text-transform: uppercase; font-weight: 700;}.btn{background: #d21; color: #fff; padding: 5px 10px; border-radius: 5px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;}header{background: #eee; padding: 20px; display: flex; align-items: center; justify-content: space-between;}.body{padding: 12px; color: #777; line-height: 17px; font-size: 12px; font-family: Arial, Helvetica, sans-serif;}h1{font-weight: 600; margin-bottom: 12px; font-size: 20px;}.logo{height: 30px;}article{margin-top: 12px; background: #eee; padding: 12px;}footer{margin-top: 12px; background: #eee; display: flex; padding: 12px;}ul{width: 50%; list-style: none;}ul h4{margin-bottom: 5px; font-size: 15px; color: #000;}ul li{padding: 5px 0;}ul a{color: #555;}</style> </head> <body> <div class="body"> <header> <img src="https://citrinerewards.vercel.app/img/logo/logo_dark_3.png" class="logo" alt=""/> <a href="https://citrinerewards.vercel.app" class="btn">Go to site</a> </header> <article> <h1>Dear ${email.split('@')[0]}</h1> <h2>${post.title}</h2> <div>${post.body}</div></article> <footer> <ul> <h4>Quick Links</h4> <li> <a href="https://citrinerewards.vercel.app/dashboard" >My Dashboard</a > </li><li> <a href="https://citrinerewards.vercel.app/login">Login</a> </li><li> <a href="https://citrinerewards.vercel.app/signup">signup</a> </li></ul> <ul> <h4>Contact us</h4> <li> <a href="tel:09071567936">09071567936</a> </li><li> <a href="mailto:citrinerewrds@gmail.com" >citrinerewards@gmail.com</a > </li></ul> </footer> </div></body></html>`
    let mailOptions = {
        to: "odunmilade@gmail.com",
        from: '"Info from Citrine Rewards" <citrinerewards@gmail.com> ',
        subject: 'Citrine Rewards:' + post.title.toUpperCase(),
        text: 'This is the text from regwrites'
    };
    admin.database().ref('users/').once('value', s => {
        for (let keys in s.val()) {
            mailOptions.to = s.val()[keys].email
            mailOptions.html = htmlTemp(s.val()[keys].email)
            sendM(mailOptions, s.val()[keys].email)
        }
    })
    return null
})