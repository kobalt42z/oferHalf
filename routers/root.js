// ?respond with "hello world" when a GET request is made to the homepage
const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ msg: 'hello world from root' })
})


router.post('/', (req, res) => {
  let data = req.body;
  res.json(data)
})
module.exports = router;