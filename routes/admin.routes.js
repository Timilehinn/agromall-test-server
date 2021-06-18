const { verify } = require("jsonwebtoken");
const verifyJWT = require("../utils/verifyJWT.js");

module.exports = app => {
    const admin = require("../controllers/admin.controller.js");
  
    var router = require("express").Router();

    router.post('/signup',admin.createNewUser)
    router.post('/signin',admin.signIn)
  
    app.use('/api/admin', router);
  };