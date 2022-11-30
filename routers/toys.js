// ?respond with "hello world" when a GET request is made to the homepage
const express = require('express');
const { ToysModel, toysValidation } = require('../models/toysModel');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        let data = await ToysModel
            .find({})
        res.json(data)

    } catch (error) {
        console.log(error);
    }

})

router.post('/', async (req, res) => {

    let validateRequest = toysValidation(req.body);
    if (validateRequest.error) {
        return res.status(400).json(validateRequest.error.details)
    }


    try {
        // * model the data requestBody
        let dataRequset = ToysModel(req.body);
        // * finde the data over the db and stor in data check
        let dataCheck = await ToysModel.find({ name: dataRequset.name, })

        // * if data is alredy existe in db return alredy exist 
        if (dataCheck[0].name === dataRequset.name) {
            console.log("alredy!!!!!");
            return res.status(400).json({ msg: "alredy existe!" })
        }
        // * else save the data in db and send confirmation to client
        await dataRequset.save();
        // * send msg + data you've saved 
        res.status(201).json({ msg: "saved successfully!", dataRequset })

    } catch (error) { //* on error exit and send error to user with status code 
        console.log(error);
        res.status(500).json(error);
    }
})

module.exports = router;