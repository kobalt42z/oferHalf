const mongoose = require('mongoose');
const Joi = require('joi');
const { date } = require('joi');
const jwt = require('jsonwebtoken');
const { config } = require('../config/secret')


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


exports.creatToken = userId => {
    jwt.sign({ _id: userId },config.tokenSecret,{expiresIn:"60mins"})
}

