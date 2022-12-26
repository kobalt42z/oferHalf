// getting-started.js
const mongoose = require('mongoose');
const {config} = require('../config/secret');

main().catch(err => console.log(err));

async function main() {
 try {
  await mongoose.connect(`mongodb+srv://${config.userDB}:${config.pwdDB}@cluster0.5qm9mrs.mongodb.net/Vg`);
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled

  console.log("successfully connected to Vg db !");
 } catch (error) {
  console.log(error);
 }
}