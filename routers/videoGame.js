// ?respond with "hello world" when a GET request is made to the homepage

const express = require('express');
const { VgModel, vgValidation } = require('../models/videoGameModel');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        let data = await VgModel.find({})
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
                elementValidation = vgValidation(element)
                if (elementValidation.error) {
                    return res.status(400).json(elementValidation.error.details);
                }
                let elementModeling = VgModel(element)
                toInsert.push(elementModeling)
            })
            // ? return the checked and modeled array to call
            return toInsert;
        }

        try {
            // ? check aryy is called and wait to finish
            let checkedArray = await checkArry(req.body)
            // ? push all arry to db 
            await VgModel.insertMany(checkedArray)
            // ? res to client with 200 and the data that he post 
                return res.status(200).json({ msg: 'uploaded sucessfuly !', data: checkedArray })
            
           

        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: 'faild to upload to db ',error});
        }


    }
    // ? if its not an arry consider him as a singel object 
    else {
        // ? do joi check  to req.body if ok passs else return error to client
        let validateRequest = vgValidation(req.body);
        if (validateRequest.error) {
            return res.status(400).json(validateRequest.error.details)
        }

        // ? check if its alredy exist and try to post in db 
        try {
            // * model the data requestBody
            let dataRequset = VgModel(req.body);

            // * else save the data in db and send confirmation to client
            await dataRequset.save();

            // * send msg + data you've saved 
            res.status(201).json({ msg: "saved successfully!", dataRequset })

        } catch (error) { //* on error exit and send error to user with status code 
            console.log(error);
            res.status(500).json({msg: "faild to save !",error});
        }
    }
})

router.delete('/delAll', async (req, res)=>{
    try {
        await VgModel.deleteMany({})
    res.status(200).json({msg:'ok'})
    } catch (error) {
        res.status(500).json({msg:error})
    }
});

// ? with search query 
router.get('/search', async (req, res) => {
    try {
        let maxPerPage = Number(req.query.perPage) || 4;
        let searchQuery = req.query.s
        let page = req.query.page
        let sort = req.query.sort || "_id";
        let reverse = req.query.reverse == "yes" ? 1 : -1;
        //? make it a regular expression for match even part of word or if its case sensitive.
        let regoulared = new RegExp(searchQuery, 'i')

       


        //    * finde using regex in db 
        let data = await VgModel
            .find({ Game: regoulared })
            .limit(maxPerPage)
            .skip((page-1) * maxPerPage )
            .sort({[sort]:reverse})


        res.status(200).json({ data: data })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
})

module.exports = router;