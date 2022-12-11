// ?respond with "hello world" when a GET request is made to the homepage
const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ msg: 'hello world from root' })


})

// *** test!!!! ****
router.post('/',auth,isAdmin, (req, res) => {
  let data = req
 console.log(req.header("x-api-key"));
 res.json({msg: 'hello world fromroot'})
  


})


module.exports = router;