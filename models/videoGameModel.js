const mongoose = require('mongoose');
const Joi = require('joi');



// 
/**
 * ? schema of toy -> sended by mongoose to database
 * ? build by Schema constructor of mongoose 
 */
const vgSchema = new mongoose.Schema({
    Game: String,
    Genre: String,
    GameLink: String,
    Year: Number,
    Dev: String,
    DevLink: String,
    Publisher: String,
    PublisherLink: String,
    Platform: String,
    PlatformLink: String,
    AdedBy: {
        type: String,
        default: "system"
    },
    date_created: {
        type: Date,
        default: Date.now()
    }
})



// ? export toys model for router using
// ? args: name of model , ref of model function , name of collection
exports.VgModel = mongoose.model("vgModel", vgSchema,"one");

exports.vgValidation = (bodyRequest) => {
    /*
    * validate the data befor sendind to db 
    * dataUri check that is trhuly a uri/l 
    * as it mentioned in the Joi API DOCS
    */
    let joiSchema = Joi.object({
        Game: Joi.string().min(2).max(30).required().allow("",null),
        Genre: Joi.string().min(2).max(30).required().allow("",null),
        GameLink: Joi.string().required().allow("",null),
        Year: Joi.number().min(1900).max(2100).required(),
        Dev: Joi.string().min(2).max(30).required().allow("",null),
        DevLink: Joi.string().required().allow("",null),
        Publisher: Joi.string().min(2).max(30).required().allow("",null),
        PublisherLink: Joi.string().required().allow("",null),
        Platform:  Joi.string().min(2).max(30).required().allow("",null),
        PlatformLink: Joi.string().required().allow("",null),
        
    })
    return joiSchema.validate(bodyRequest)
}

exports.delGameValidation = bodyRequest => {
    let joiSchema = Joi.object({
        _id: Joi.string().alphanum().required()
    })
    return joiSchema.validate(bodyRequest)
}