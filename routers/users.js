// ?respond with "hello world" when a GET request is made to the homepage
const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const { UserModel, userValidation, creatToken, loginValidation, delUserValidation } = require('../models/userModel');
const router = express.Router();

router.get('/login', (req, res) => {
  res.json({ msg: 'POST here for login !' })


})

router.post('/signIn', async (req, res) => {
  let validateRequest = userValidation(req.body)
  if (validateRequest.error) {
    return res.status(403).json(validateRequest.error.details)
  }

  try {
    let data = UserModel(req.body);
    await data.save();
    res.status(200).json({ msg: `${data.userName} are added successfully!` })
  } catch (error) {
    if (error.code === 11000) res.status(400).json({ problem: error.keyValue, msg: ` alredy exist!`, error: error });
    else res.status(500).json({ msg: error });
    console.log(error);

  }
})

router.post('/login', async (req, res) => {
  let validateReq = loginValidation(req.body)
  if (validateReq.error) {
    return res.status(401).json(validateReq.error.details)
  }
  try {
    let data = req.body;

    // ? check that : (userName OR email) AND (password) are existing in db 
    let search = await UserModel.findOne({ $and: [{ $or: [{ userName: data.account }, { email: data.account }] }, { password: data.password }] })

    if (!search) {
      return res.status(401).json({ msg: 'invalid credentials ' })
    }
    let token = creatToken(search._id, search.role)
    res.status(200).json({ token: token })

  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
})

router.get('/myInfo', auth, async (req, res) => {
  // res.json(req.tokenData.id);
  let data = await UserModel.findOne({ _id: req.tokenData.id })
  // console.log(data);
  res.status(200).json({ msg: `sucessfuly logged in as ${data.userName}`, data: data });

})


// *______ADMIN SECTION______*

router.delete('/delUser', auth, isAdmin, async (req, res) => {
  let validDel = delUserValidation(req.query.target.value)
  if (validDel.error) {
    return res.status(401).json(validDel.error.details)
  }
  try {
    
    let userToDel = req.query.target
    //  await UserModel.findOne({ _id: userToDel }) 
    let data = await UserModel.deleteOne({ _id: userToDel })
    if (data.deletedCount == 0) {
      return res.status(400).json({ msg: `faild to delete ${userToDel} user not existing in DB ` })
    } else {
      res.status(200).json({ msg: `${userToDel} -> deleted successfully!`, data })
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
})

router.patch('/updateUser', auth, isAdmin, async (req, res) => {
  let validUpdate = delUserValidation(req.query.target.value)
  if (validUpdate.error) {
    return res.status(401).json(validUpdate.error.details)
  }
  try {
    let target = req.query.target
    let toUpdate = req.body
    
    let data = await UserModel.updateOne({ _id: target }, {$set:toUpdate })
    if(!data.matchedCount){
      return res.status(401).json({ msg: `${target} not existing in DB `})
    }
    if(!data.modifiedCount){
      return res.status(401).json({ msg: `${target} existing in DB , but no change have been made ! `})
    }
    res.status(200).json({ msg: `${target} -> updated successfully!`, data })

    
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
})
router.get('/browse',auth,isAdmin,async(req, res) => {
  try {
    let maxPerPage = Number(req.query.perPage) || 4;
    let searchQuery = req.query.s
    let page = req.query.page
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? 1 : -1;
    //? make it a regular expression for match even part of word or if its case sensitive.
    let regoulared = new RegExp(searchQuery, 'i')

   


    //    * finde using regex in db 
    let data = await UserModel
   
        .find({ $or:[{userName: regoulared},{email: regoulared}] })
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
