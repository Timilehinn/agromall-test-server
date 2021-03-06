const { verify } = require("jsonwebtoken");
const verifyJWT = require("../utils/verifyJWT.js");

module.exports = app => {
    const admin = require("../controllers/admin.controller.js");
  
    var router = require("express").Router();

    // router.post('/register',admin.createNewUser) // remember to delete this
    router.post('/login',admin.signIn)
    router.get('/isuserauth', verifyJWT, admin.isUserAuth)
  
    app.use('/api/admin', router);
  };