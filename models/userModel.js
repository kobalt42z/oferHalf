const mongoose = require('mongoose');
const Joi = require('joi');
const { date } = require('joi');


// 
/**
 * ? schema of user -> sended by mongoose to database
 * ? build by Schema constructor of mongoose 
 */
const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    email: String,
    date_created: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        default: 'user'
    }


});

exports.UserModel = mongoose.model("userModel", userSchema, "users");

// !continue the pattern 
exports.userValidation = bodyRequest => {
    let joiSchema = Joi.object({
        userName: Joi.string().alphanum().min(2).max(30).required(),
        password: Joi.string().alphanum().min(8).max(16).required(),
        email: Joi.string().email().required(),
    })
    return joiSchema.validate(bodyRequest);
}

exports.loginValidation = bodyRequest => {
    let joiSchema = Joi.object({
        userName: Joi.string().alphanum().min(2).max(30).required(),
        password: Joi.string().alphanum().min(8).max(16).required()
    })
};


// ! need to ne nuilded
/*
* token sign in 
* validtion of usser by joi 
*validation to login by joi username && pasword
 */