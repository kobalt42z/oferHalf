// ?respond with "hello world" when a GET request is made to the homepage

const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const { VgModel, vgValidation ,delGameValidation } = require('../models/videoGameModel');
const router = express.Router();



router.get('/', auth, async (req, res) => {
    try {
        let maxPerPage = Number(req.query.perPage) || 4;
        let page = req.query.page
        let sort = req.query.sort || "_id";
        let reverse = req.query.reverse == "yes" ? 1 : -1;
        let data = await VgModel
            .find({})
            .limit(maxPerPage)
            .skip((page - 1) * maxPerPage)
            .sort({ [sort]: reverse })

        res.json(data)

    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }

})



// ? allow you to add a new game or an array of games to the collection 
router.post('/', auth, async (req, res) => {

    // ? if its not an arry consider him as a singel object 

    // ? do joi check  to req.body if ok passs else return error to client
    let validateRequest = vgValidation(req.body);
    if (validateRequest.error) {
        return res.status(400).json(validateRequest.error.details)
    }

    // ? check if its alredy exist and try to post in db 
    try {
        // * model the data requestBody
        let dataRequset = VgModel(req.body);
        console.log(dataRequset);
        console.log(req.tokenData.id);
        dataRequset.AdedBy = req.tokenData.id
        // * else save the data in db and send confirmation to client
        await dataRequset.save();

        // * send msg + data you've saved 
        res.status(201).json({ msg: "saved successfully!", dataRequset })

    } catch (error) { //* on error exit and send error to game with status code 
        if (error.code === 11000) res.status(400).json({ problem: error.keyValue, msg: ` alredy exist!`, error: error });
        else res.status(500).json({ msg: error });
        console.log(error);
    }

})
// ! need check
// ?allow you to del games by id passsed into "target" query
router.delete('/delVg', auth, isAdmin, async (req, res) => {
    // *joi validation 
    let validDel = delGameValidation(req.query.target.value)
    if (validDel.error) {
        return res.status(401).json(validDel.error.details)
    }
    try {

        let gameToDel = req.query.target
        //  await VgModel.findOne({ _id: gameToDel }) 
        let data = await VgModel.deleteOne({ _id: gameToDel })
        // ? if deleted count is returned 0 than throw back an error 
        if (data.deletedCount == 0) {
            return res.status(400).json({ msg: `faild to delete ${gameToDel} game not existing in DB ` })
        } else {
            res.status(200).json({ msg: `${gameToDel} -> deleted successfully!`, data })
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ err: err });
    }
})



// ? with search query 
router.get('/search', auth, async (req, res) => {
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
            .skip((page - 1) * maxPerPage)
            .sort({ [sort]: reverse })


        res.status(200).json({ data: data })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
})

module.exports = router;