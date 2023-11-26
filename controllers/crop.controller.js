const axios = require('axios');
const { farmerDetailsModel, farmerCropsModel } = require('../models/farmer.model');

const getCropPrediction = async (req, res) => {
    console.log(req.body);
    let { Country, label, ph, temperature, humidity, waterAvailability, id } = req.body;
    if (temperature == undefined) {
        console.log('First Model Request');
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "label": label,
            "Country": Country
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://prediction-engine-practice.onrender.com/predict_regression/", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result.predictions)
                // let upload = farmerCropsModel.findOneAndUpdate({ farmerId: id }, { $push: { crops: {details: { label, Country }, predictions: result?.predictions} } })
                // if (upload == null) {
                //     farmerCropsModel({ farmerId: id, crops: [{ details: { label, Country }, predictions: result?.predictions }] }).save()
                // }
                res.status(200).json(data = { details: { Country, label }, predictions: result?.predictions });
            })
            .catch(error => {
                console.log('error', error);
                res.status(500).json({message: 'Server Error'})
            });

        // axios.post('https://­prediction-engine-pra­ctice.onrender.com/­predict_classification/', JSON.stringify(details))
        // .then((result)=>{
        //     console.log('result', result);
        //     console.log('result', result.data);
        //
        // })
        // .catch((err)=>{
        //     console.log(err);
        // })
        // try {
        //     const response = await fetch('https://­prediction-engine-pra­ctice.onrender.com/­predict_classificatio­n/', {
        //         method: 'POST',
        //         // headers: {
        //         //     'Content-Type': 'application/json'
        //         // },
        //         body: JSON.stringify(details)
        //     })
        //     console.log(response);
        //     const data = await response.json()
        //     console.log(data);
        // } catch (error) {
        //     console.error(error);
        // }
    } else {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "label": label,
            "Country": Country,
            "temperature": temperature,
            "humidity": humidity,
            "water availability": waterAvailability,
            "ph": ph
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://prediction-engine-practice.onrender.com/predict_classification/", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result.predictions)
                let upload = farmerCropsModel.findOneAndUpdate({ farmerId: id }, { $push: { crops: { details: { Country, label, ph, temperature, humidity, waterAvailability }, predictions: result.predictions } } })
                if (upload == null) {
                    farmerCropsModel({ farmerId: id, crops: [{ details: { Country, label, ph, temperature, humidity, waterAvailability }, predictions: result.predictions }] }).save()
                }
                res.status(200).json(data = { details: { Country, label, ph, temperature, humidity, waterAvailability }, predictions: result.predictions });
            })
            .catch(error => {
                console.log('error', error)
                res.status(500).json({ message: 'Server Error' })
            });

    }
}

const findCrop = async (req, res) => {
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

module.exports = { getCropPrediction }