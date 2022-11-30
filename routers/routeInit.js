/** 
 *  * this file init all router inside a function 
 *  * the function get app as an argument
 *  *and use the Router() method to build a router function 
 *  *as explained in Router() section in express docs 
*/

const express = require('express')
const app = express()
const root = require('./root');
const toys = require('./toys');


//? function taht init all the raoutes
exports.routesInit = app =>{
    app.use('/',root)
    app.use('/toys',toys)
    
}