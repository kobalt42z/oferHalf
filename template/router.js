const express = require('express')
const router = express.Router() ;

router.__METHOD__('__pathName__', (req, res) => {
    res.json(__data__)
  })

module.exports = router;