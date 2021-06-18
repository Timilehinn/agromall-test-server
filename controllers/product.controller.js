const db = require("../models");
const { QueryTypes, Sequelize } = require("sequelize")
const Product = db.products;
const JWT = require('jsonwebtoken');
const { products } = require("../models");

exports.createNew = (req, res) => {
  console.log(req.body)
  const { images,name,desc,location,category, } = req.body
      Product.create(req.body)
      .then(data => {
          res.json({msg:'All products',success:true,done:true,data:data});
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({
          message:
            err.message || "Error finding products."
        });
      });
};

exports.all=(req,res)=>{
  const { limit,offset } = req.query
  Product.findALl({
    order:[
      ['id','DESC']
    ],
    limit,
    offset,
  }).then(product=>{
    res.json({msg:'All products',success:true})
  }).catch(err=>{
    res.status(500).json({msg:"An error occurred",success:true});
  })
}
