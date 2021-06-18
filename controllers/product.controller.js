const db = require("../models");
const { QueryTypes, Sequelize } = require("sequelize")
const Product = db.products;
const JWT = require('jsonwebtoken');

exports.addNewProduct = (req, res) => {
  const { email,fullname,password } = req.body
      Product.create(product)
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
