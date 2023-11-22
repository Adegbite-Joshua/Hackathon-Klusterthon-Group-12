const axios = require('express');

const getCropPrediction = (req, res) => {
    console.log(req.body);
    let {location, cropName, pH, temperature, humidity, water} = req.body;
    if(!temperature){
        console.log('First Model Request');
    } else {
        console.log('Second Model Request');
    }
    res.status(200).json({data: 'Working on the connecting to the ML Model'});
}

module.exports = {getCropPrediction}