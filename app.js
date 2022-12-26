const express = require('express')
const path = require('path');
require("./database/connect")
const { routesInit } = require('./routers/routeInit.js');
const cors = require('cors');
const {checkToken} = require('./middleware/auth');
// * creat a server called app 
const app = express()
app.use(cors());
  
// * port of app server
const port = 3000

// * alllow you to parse all reqs to json 
app.use(express.json());

// * init the router by passing app as argument to routerInit 
// *located at --> ./routers
routesInit(app)

// ? init the server with port and log when ready
app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})

// * make public folder acsessible for client
app.use(express.static(path.join(__dirname, 'public',)));


const corsOptions ={
    origin:"http://localhost:4000", 
    // credentials:true,            access-control-allow-credentials:true
    optionSuccessStatus:200
}
