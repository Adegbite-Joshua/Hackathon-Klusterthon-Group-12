const axios = require('axios');

const getCropPrediction = (req, res) => {
    console.log(req.body);
    let {location, cropName, ph, temperature, humidity, water} = req.body;
    if(!temperature){
        console.log('First Model Request');
        // console.log([label= cropName, Country= location]);
        
        axios.post('https://­planting-time-predict­ion-engine.onrender.­com/­predict_regression/', input_data=[label= cropName, Country= location])
        .then((result)=>{
            console.log('result', result);
        })
        .catch((err)=>{
            console.log(err);
        })
    } else {
        console.log('Second Model Request');
        axios.post('https://­planting-time-predict­ion-engine.onrender.­com/­predict_classificatio­n/', {
            Country: location,
            label: cropName, 
            ph, 
            temperature, 
            humidity, 
            "water availablity": water
        })
        .then((result)=>{
            console.log('result', result);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    res.status(200).json({data: 'Working on the connecting to the ML Model'});
}

module.exports = {getCropPrediction}