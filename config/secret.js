require("dotenv").config();
console.log(process.env.USER_DB);
exports.config = {
  userDB:process.env.USER_DB,
  pwdDB:process.env.PWD_DB,
  // tokenSecret:process.env.TOKEN_SECRET
}