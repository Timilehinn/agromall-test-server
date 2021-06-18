const JWT = require('jsonwebtoken')

const verifyJWT = (req,res,next)=>{
    const token = req.headers["x-access-token"];
    if(!token || token == 'null') {
      res.status(401).json({msg:'No Token Found',done:true,success:false,authenticated:false})
    }else{
      JWT.verify(token, process.env.JWT_SECRET, (err,decoded)=>{
        if(err) {
          res.status(401).json({msg:'Authentication Failed',done:true,success:false,authenticated:false})
        }else{
          req.userId = decoded.id;
          req.userEmail = decoded.email;
          next();
        }
      })
    }
  }

module.exports = verifyJWT;