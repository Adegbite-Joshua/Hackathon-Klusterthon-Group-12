const axios = require('axios');
const { farmerDetailsModel, farmerCropsModel } = require('../models/farmer.model');

const getCropPrediction = async(req, res) => {
    console.log(req.body);
    let {Country, label, ph, temperature, humidity, water, id} = req.body;
    if(!temperature){
        console.log('First Model Request');
        let details = {
            label: 'cotton',
            Country: 'Nigeria',
            ph: 6.5,
            humidity: 80.0,
            waterAvailability: 0.6,
            temperature: 25.5
        };
        // axios.post('https://­prediction-engine-pra­ctice.onrender.com/­predict_classification/', details)
        // .then((result)=>{
        //     console.log('result', result);
        //     console.log('result', result.data);
        //     // let upload = farmerCropsModel.findOneAndUpdate({farmerId: id}, {$push: {crops: {label: cropName, Country: location}}})
        //     // if(upload==null){
        //     //     farmerCropsModel({farmerId: id, crops: [{label: cropName, Country: location}]}).save()
        //     // }
        // })
        // .catch((err)=>{
        //     console.log(err);
        // })
        try {
            const response = await fetch('https://­prediction-engine-pra­ctice.onrender.com/­predict_classificatio­n/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(details)
            })
            console.log(response);
            const data = await response.json()
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log('Second Model Request');
        axios.post('https://­prediction-engine-pra­ctice.onrender.com/­predict_classificatio­n/', {
            Country,
            label, 
            ph, 
            temperature, 
            humidity, 
            "waterAvailablity": water
        })
        .then((result)=>{
            console.log('result', result);
            // let upload = farmerCropsModel.findOneAndUpdate({farmerId: id}, {$push: {crops: {Country: location,label: cropName, ph, temperature, humidity, "water availablity": water}}})
            // if(upload==null){
            //     farmerCropsModel({farmerId: id, crops: [{Country: location,label: cropName, ph, temperature, humidity, "water availablity": water}]}).save()
            // }
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    res.status(200).json({data: 'Working on the connecting to the ML Model'});
}

const findCrop = async(req, res) => {
    const regex = new RegExp(searchLetter, 'i'); // 'i' flag for case-insensitive search

    // Use $regex to search for the letter in any field
    const result = await farmerCropsModel.find({ $or: [{ crops: { $regex: regex } }] }).toArray();
    // [
    //     {
    //       $search: {
    //         index: "default",
    //         text: {
    //           query: "cotton",
    //           path: {
    //             wildcard: "*"
    //           }
    //         }
    //       }
    //     }
    //   ]
    console.log('Search result:', result);
}

module.exports = {getCropPrediction}