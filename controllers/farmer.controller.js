const { farmerDetailsModel } = require("../models/farmer.model");
const { verify } = require('jsonwebtoken');

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


// Functions For The Farmer's Sign In
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

const getFarmerDetails = (req, res) => {
    let {token} = req.body;
    verify(token, process.env.JWTSECRET, (error, result) => {
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

module.exports = {createAccount, signIn, getFarmerDetails}