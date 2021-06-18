const db = require("../models");
const { QueryTypes, Sequelize } = require("sequelize")
const User = db.users;
const JWT = require('jsonwebtoken');

exports.createNewUser = (req, res) => {
  const { email,fullname,password } = req.body
  User.findOne({where:{
    email:email
  }}).then((_user)=>{
    if(!_user){ 
      const user = {
        fullname : fullname,
        email : email.toLowerCase(),
        password:password,
      }
      User.create(user)
      .then(data => {
          res.json({msg:'registered successfully, Login to continue.',success:true,data:data});
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({
          message:
            err.message || "Error occurred while creating account."
        });
      });
    }else{
        console.log('Username/Email already registered')
        res.json({msg:'Username/Email is already registered, try loggin in',success:false})
    }
  })
};

exports.signIn = (req,res) => {
  const { email,password } = req.body
  User.findOne({where:{email:email}}).then((user)=>{
    if(!user){
      res.json({auth_msg:'no user with that email or username',done:true,session:false,email:email})
    }else if(user.dataValues.password !== password){
      res.json({auth_msg:'password is incorrect',done:true,session:false,email:email})
    }else{
      User.findOne({where:{email:email},attributes: {exclude:['password']}}).then(user=>{
        const id = user.dataValues.id
        const email = user.dataValues.email
        const token = JWT.sign({id,email}, process.env.JWT_SECRET, {
          expiresIn:'1d',
        })
        res.json({auth_msg:'login successful.',email,done:true, session:true,token:token,details:user.dataValues})
      })
    }
  })
  .catch(err => {
    console.log(err)
    res.json({auth_msg:'An error occurred.',done:true, session:false}).status(500)
    console.log(err)

  })
}


exports.isUserAuth = (req,res) =>{
  console.log(req.userEmail)
  User.findOne({ where: {email:req.userEmail},attributes: {exclude:['password']} })
  .then((data) => {
    if(data){
      res.json({msg:'you are authorised',details:data.dataValues, authenticated:true})
    }else{
      res.json({msg:'not auth', authenticated:false}).status(401)
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({auth_msg:'An error occurred.', authenticated:false})
  });
};
