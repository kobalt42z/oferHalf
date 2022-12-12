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
        Game: Joi.string().min(2).max(30).required(),
        Genre: Joi.string().min(2).max(30).required(),
        GameLink: Joi.string().required(),
        Year: Joi.number().min(1900).max(2100).required(),
        Dev: Joi.string().min(2).max(30).required(),
        DevLink: Joi.string().required(),
        Publisher: Joi.string().min(2).max(30).required(),
        PublisherLink: Joi.string().required(),
        Platform:  Joi.string().min(2).max(30).required(),
        PlatformLink: Joi.string().required(),
        
    })
    return joiSchema.validate(bodyRequest)
}

exports.delGameValidation = bodyRequest => {
    let joiSchema = Joi.object({
        _id: Joi.string().alphanum().required()
    })
    return joiSchema.validate(bodyRequest)
}
exports.vgUpdateValidation = (bodyRequest) => {
    /*
    * validate the data befor sendind to db 
    * dataUri check that is trhuly a uri/l 
    * as it mentioned in the Joi API DOCS
    */
    let joiSchema = Joi.object({
        Game: Joi.string().min(2).max(30),
        Genre: Joi.string().min(2).max(30),
        GameLink: Joi.string(),
        Year: Joi.number().min(1900).max(2100),
        Dev: Joi.string().min(2).max(30),
        DevLink: Joi.string(),
        Publisher: Joi.string().min(2).max(30),
        PublisherLink: Joi.string(),
        Platform:  Joi.string().min(2).max(30),
        PlatformLink: Joi.string()
        
    })
    return joiSchema.validate(bodyRequest)
}