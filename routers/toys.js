// ?respond with "hello world" when a GET request is made to the homepage

const express = require('express');
const { ToysModel, toysValidation } = require('../models/toysModel');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        let data = await ToysModel.find({})
        res.json(data)

    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }

})


// ! bug:line 39: asnyc problem with aray check if its alredy exsist 
// ! its resolved befor the checks 
// ? for now its just insert many without check many
router.post('/', async (req, res) => {

    // *check if its an array 
    if (Array.isArray(req.body)) {
        /*
        * function that cheke the array validation and if its alredy exsist
        * and append it to db 
         */
        async function checkArry(array) {
            //    ? init the arry to return at the end
            let toInsert = [];
            // ? for every element at array  make Joi check if its ok push to toInsert[]
            await array.forEach(async (element) => {
                elementValidation = toysValidation(element)
                if (elementValidation.error) {
                    return res.status(400).json(elementValidation.error.details);
                }

                // ? solve : use Indexes at DB
                // * check if exist in db if exist res =id if dont exist res = null 
                // ! he suposed to wait until chek is end 
              

                let elementModeling = ToysModel(element)
                toInsert.push(elementModeling)


                // * if data is alredy existe in db return alredy exist 


            })
            // ? return the checked and modeled array to call
            return toInsert;




        }
        try {
            // ? check aryy is called and wait to finish
            let checkedArray = await checkArry(req.body)
            console.log(checkedArray.length);
            // ? push all arry to db 
            if (checkedArray.length != 0) {
                await ToysModel.insertMany(checkedArray)
                // ? res to client with 200 and the data that he post 
                return res.status(200).json({ msg: 'recived', data: checkedArray })
            }
            return res.status(500).json({ msg: 'faild data is alredy exist !'})

        } catch (error) {
            console.log(error);
            return res.status(400).json(error);
        }


    }
    // ? if its not an arry consider him as a singel object 
    else {
        // ? do joi check  to req.body if ok passs else return error to client
        let validateRequest = toysValidation(req.body);
        if (validateRequest.error) {
            return res.status(400).json(validateRequest.error.details)
        }

        // ? check if its alredy exist and try to post in db 
        try {
            // * model the data requestBody
            let dataRequset = ToysModel(req.body);

            // * finde the data over the db and stor in data check
            let dataCheck = await ToysModel.find({ name: dataRequset.name, })



            // * if data is alredy existe in db return alredy exist 
            if (dataCheck[0] != null && dataCheck[0].name === dataRequset.name) {
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
    }
})

router.delete('/delAll', async (req, res)=>{
    try {
        await ToysModel.deleteMany({})
    res.status(200).json({msg:'ok'})
    } catch (error) {
        res.status(500).json({msg:error})
    }
});

// ? with search query 
router.get('/search', async (req, res) => {
    try {
        let searchQuery = req.query.s

        //? make it a regular expression for match even part of word or if its case sensitive.
        let regoulared = new RegExp(searchQuery, 'i')

        let maxPerPage = 2;


        //    * finde using regex in db 
        let data = await ToysModel
            .find({ name: searchQuery })
            .limit(maxPerPage)
            .skip(2)


        res.status(200).json({ data: data })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
})

module.exports = router;