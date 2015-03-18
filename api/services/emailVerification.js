var _ = require('underscore');
var fs = require('fs');
var jwt = require('jwt-simple');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var config = require('./config.js');

var model = {
    verifyUrl: 'http://localhost:3000/auth/verifyEmail?token=',
    title: 'psJwt',
    subTitle: 'Thanks for signing up!',
    body: 'Please verify your email address by clicking the button below'
};

exports.send = function(email) {

    console.log('teste');

    var payload = {
        sub: email
    };

    var token = jwt.encode(payload, config.EMAIL_SECRET);

    var transporter = nodemailer.createTransport(smtpTransport(
        {
            host: 'smtpout.secureserver.net',
            secure: true,
            auth: {
                user: 'alex@socialplay.com',
                pass: config.SMTP_PASS
            }
        }
    ));

    var mailOptions = {
        from: 'Accounts <accounts@socialplay.com>',
        to: email,
        subject: 'psJwt Account Verification',
        html: getHtml(token)
    };

    transporter.sendMail(mailOptions,function(err, info){
        console.log(err);
        if(err) return res.status(500, err);

        console.log('email sent ', info.response);
    })
};
_.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
};

function getHtml(token){
    var path = './views/emailVerification.html';
    var html = fs.readFileSync(path, encoding = 'utf8');

    var template = _.template(html);

    model.verifyUrl += token;

    return template(model);
};