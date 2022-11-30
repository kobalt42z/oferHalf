const mongoose = require('mongoose');
const Joi = require('joi');
const { request } = require('express');

// 
/**
 * ? schema of toy -> sended by mongoose to database
 * ? build by Schema constructor of mongoose 
 */
const toysSchema = new mongoose.Schema({
    name: String,
    info: String,
    category: String,
    imgUrl: String,
    price: Number,
    user_id: String,
    date_created: {
        type: Date,
        default: Date.now()
    }
})
// ? export toys model for router using
// ? args: name of model , ref of model function , name of collection
exports.ToysModel =  mongoose.model("toysModel",toysSchema,"toys");

exports.toysValidation = bodyRequest =>{
    /*
    * validate the data befor sendind to db 
    * dataUri check that is trhuly a uri/l 
    * as it mentioned in the Joi API DOCS
    */
    let joiSchema = Joi.object({
        name:Joi.string().alphanum().min(2).max(30).required(),
        info:Joi.string().min(2).max(1000).required(),
        category:Joi.string().min(2).max(20).required(),
        imgUrl:Joi.string().required(),
        price: Joi.number().min(1).max(999999).required(),
        // user_id:Joi.string()
    })
    return joiSchema.validate(bodyRequest)
}