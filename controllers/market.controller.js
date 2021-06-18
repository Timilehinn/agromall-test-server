const db = require("../models");
const { QueryTypes, Sequelize } = require("sequelize")
const Market = db.markets;
const JWT = require('jsonwebtoken');

exports.createNew = (req, res) => {
  console.log(req.body)
  const { images,name,desc,location,category, } = req.body
      Market.create(req.body)
      .then(data => {
          res.json({msg:'All markets',success:true,done:true,data:data});
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({
          message:
            err.message || "Error finding markets."
        });
      });
};

exports.all=(req,res)=>{
  const { limit,offset } = req.query
  Market.findALl({
    order:[
      ['id','DESC']
    ],
    limit,
    offset,
  }).then(product=>{
    res.json({msg:'All markets',success:true})
  }).catch(err=>{
    res.status(500).json({msg:"An error occurred",success:true});
  })
}
