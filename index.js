const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const userRoute = require('./routes/farmer.route')


const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
    .then(()=>{
        console.log('MongoDB connected');
    })
    .catch((err)=>{
        console.error('Error Connecting To MongoDB', err);
    })

app.use('/farmer', userRoute)

app.get('/', (req, res)=>{
    res.status(200).json({
        name: 'Klusterthon Group 12',
        Backend: 'Backend'
    })
})

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log('server started')
})