// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
 try {
  await mongoose.connect('mongodb+srv://chm:1354213542@cluster0.5qm9mrs.mongodb.net/Toys');
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled

  console.log("successfully connected to Toys db !");
 } catch (error) {
  console.log(error);
 }
}