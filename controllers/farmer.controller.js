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
            from: process.env.USEREMAIL,
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