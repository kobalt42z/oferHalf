// ?respond with "hello world" when a GET request is made to the homepage
const { json } = require('express');
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
            let toInsert =[];
            // ? for every element at array  make Joi check if its ok push to toInsert[]
             await array.forEach(async (element) => {
                elementValidation = toysValidation(element)
                if (elementValidation.error) {
                    return res.status(400).json(elementValidation.error.details);
                }
                

                // * check if exist in db if exist res =id if dont exist res = null 
                // ! he suposed to wait until chek is end 

               await ToysModel.exists({ name: element.name},(err,res)=>{
                    if (err)console.log(err);
                    if(res!==null){
                        // !bug here 
                        toInsert = {msg:"alredy exists",name:elementModeling.name}
                    }
                   
                })
                let elementModeling = ToysModel(element)
                toInsert.push(elementModeling)


                // * if data is alredy existe in db return alredy exist 
              
                
            })
            // ? return the checked and modeled array to call
            return toInsert;
            
            
             
            
        }
         try {
            // ? check aryy is called and wait to finish
            let chekedArray = await checkArry(req.body)
            // ? push all arry to db 
            await ToysModel.insertMany(chekedArray)
            // ? res to client with 200 and the data that he post 
            return res.status(200).json({ msg: 'recived', data:chekedArray })

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

module.exports = router;