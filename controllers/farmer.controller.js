const { farmerDetailsModel } = require("../models/farmer.model");
const { verify } = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: USER_EMAIL,
        pass: USER_PASSWORD
    },
    tls: {
        rejectUnauthorized: false,
    },

})

// Function For The Famer's Create Account
const createAccount = (req, res) => {
    console.log(req.body);
    const farmerDetails = req.body;
    farmerDetailsModel(farmerDetails).save()
        .then((details)=>{
            res.status(200).json({message: 'Account Created'})
            console.log(details)
            let mailOptions = {
                from: process.env.USER_EMAIL,
                to: [email],
                subject: 'Pasword Reset',
                html: `<div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-radius: 8px; margin-top: 20px;">
                        <h1 style="color: #333333;">Welcome to Klusterthon!</h1>
                        <p style="color: #666666;">Dear ${detail.firstName},</p>
                        <p style="color: #666666;">Thank you for creating an account on Klusterthon! We're excited to have you on board.</p>
                        <p style="color: #666666;">To get started, click the button below to log in to your account:</p>
                        <a href="" style="display: inline-block; padding: 10px 20px; margin-top: 20px; font-size: 16px; text-align: center; text-decoration: none; background-color: #4CAF50; color: #ffffff; border-radius: 5px; transition: background-color 0.3s;" target="_blank">Log In</a>
                        <p style="color: #666666;">If you have any questions or need assistance, feel free to contact our support team at [Your Support Email].</p>
                        <p style="color: #666666;">Best regards,<br>Klusterthon Team</p>
                    </div>
                    `
            }
            transporter.sendMail(mailOptions)
            .then((response)=>{
                console.log(response)
                res.status(200).json({message: 'Email Sent'})
            })
            .catch((err) => {
                console.log(err);
            });
        })
        .catch((err)=>{
            console.error(err);
            res.status(500).json({message: 'Server Error'})
        })
}

// Function For The Farmer's Sign In
const signIn = (req, res) => {
    console.log(req.body);
    let { password, email } = req.body
    farmerDetailsModel.findOne({ email })
        .then((details) => {
            if (details == null) {
                return res.status(477).json('Invalid Login Details')
            }
            console.log(details)
            const JWT_SECRET = process.env.JWT_SECRET;
            details.validatePassword(password, (error, same) => {
                if (same) {
                    let token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '10h' })
                    res.status(200).json({ message: 'Successful', token })
                } else {
                    res.status(478).json({message: 'Wrong Password'})
                }
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({message: 'Server Error'})
        })
}

// Function For Getting The Farmer's Details
const getFarmerDetails = (req, res) => {
    let {token} = req.body;
    const JWT_SECRET = process.env.JWT_SECRET;
    verify(token, JWT_SECRET, (error, result) => {
        if (!error) {
            farmerDetailsModel.findOne({email: result.email})
            .then((details)=>{
                res.status(200).json({ details })
            })
            .catch((err)=>{
                console.error(err)
            })            
        } else {
            res.status(476).json({ message: 'Invalid Token' })
        }
    })
}

const sendResetPasswordLink = (req, res) => {
    let { email } = req.body;
    farmerDetailsModel.findOne({email}, {firstName: 1})
    .then((details)=>{
        if(details == null){
            return res.status(478).json({message: 'Invalid Email'})
        }
        let token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' })
        let mailOptions = {
            from: process.env.USER_EMAIL,
            to: [email],
            subject: 'Pasword Reset',
            html: `<h1 style='text-align:center'>Pasword Reset</h1>

                    <p style='text-align:center'>Dear ${details.firstName}, you request for a password reset link</p>
                    <a href='token'><button style='text-align:center; background-color: blue;'>Click Here</button></a>
                    <p style='text-align:center'>This link expires in the next 1 hour</p>
                    
                    <p style='text-align:center; background-color: blue;'><small>We are glad to have you!</small></p>`
        }
        transporter.sendMail(mailOptions)
        .then((response)=>{
            console.log(response)
            res.status(200).json({message: 'Email Sent'})
        })
        .catch((err) => {
            console.log(err);
        });
    })
}

const verifyResetEmail = (req, res) => {
    let { token } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET;
    verify(token, JWT_SECRET, (error, result) => {
        if (!error) {
            farmerDetailsModel.findOne({email: result.email}, {firstName: 1, lastName: 1})
            .then((details)=>{
                res.status(200).json({ details })
            })
            .catch((err)=>{
                console.error(err)
            })            
        } else {
            res.status(476).json({ message: 'Invalid Token' })
        }
    })
}

const resetPassword = (req, res) => {
    let {token, password} = req.body;
    const JWT_SECRET = process.env.JWT_SECRET;
    verify(token, JWT_SECRET, (error, result) => {
        if (!error) {
            farmerDetailsModel.findOneAndUpdate({email: result.email}, {password})
            .then((details)=>{
                res.status(200).json({ message: 'Successful' })
            })
            .catch((err)=>{
                console.error(err)
            })            
        } else {
            res.status(476).json({ message: 'Invalid Token' })
        }
    })
}

module.exports = {createAccount, signIn, getFarmerDetails, sendResetPasswordLink, verifyResetEmail, resetPassword}