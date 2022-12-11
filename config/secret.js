require("dotenv").config();

exports.config = {
  userDB: process.env.USER_DB,
  pwdDB: process.env.PWD_DB,
  tokenSecret: process.env.TOKEN_SECRET
}