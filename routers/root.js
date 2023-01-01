// ?respond with "hello world" when a GET request is made to the homepage
const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ msg: 'hello world from root' })


})

router.get('/verifyToken', auth ,(req,res)=>{
    const decodedToken = req.tokenData
    res.status(200).json({decodedToken}) 
})



module.exports = router;