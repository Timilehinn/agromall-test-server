const db = require("../models");
const { QueryTypes, Sequelize } = require("sequelize")
const Market = db.markets;
const JWT = require('jsonwebtoken');

exports.createNew = (req, res) => {
      Market.create(req.body)
      .then(data => {
          res.json({msg:'Market data created.',success:true,done:true,data:data});
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({
          message:
            err.message || "Error finding markets.",success:false
        });
      });
};

exports.all=(req,res)=>{
  const { limit,offset } = req.query
  Market.findAll({
    order:[
      ['id','DESC']
    ],
    limit,
    offset,
  }).then(market=>{
    res.json({msg:'All markets',success:true,market})
  }).catch(err=>{
    res.status(500).json({msg:"An error occurred",success:true,market:[]});
  })
}


exports.one=(req,res)=>{
  const { id }= req.query
  Market.findOne({
    where:{id}
  }).then(market=>{
    res.json({msg:'Market',success:true,market})
  }).catch(err=>{
    res.status(500).json({msg:"An error occurred",success:true,market:[]});
  })
}

exports.update=(req,res)=>{
  const { id, name, desc, location  } = req.body;
  Mark.update({
    name,desc,location,
    where:{id}
  })
  .then(()=>{
    res.json({msg:'Market details successfully updated',success:true})
  })
  .catch(err=>{
    res.status(500).json({msg:'An error occurred',success:false})
    console.log(err)
  })
}