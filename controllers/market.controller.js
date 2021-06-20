const db = require("../models");
const { QueryTypes, Sequelize } = require("sequelize")
const Market = db.markets;
const JWT = require('jsonwebtoken');
const elasticsearch = require('elasticsearch');
const bonsai_url = process.env.BONSAI_URL

const client = new elasticsearch.Client({
    hosts: bonsai_url,
    log: 'trace'
});


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
      ['createdAt','DESC']
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
  Market.update({
    name,desc,location,
  },{where:{id},returning:true})
  .then(data=>{
    Market.findAll({})
    .then(data=>{
        res.json({msg:'Market details successfully updated',market:data,success:true})
    })
    .catch(err=>{
      res.json({msg:"Something went wrong. Try refreshin the page",success:false}).status(500)
    })
  })
  .catch(err=>{
    res.status(500).json({msg:'An error occurred',success:false})
    console.log(err)
  })
}

exports.delete=(req,res)=>{
  const { markets } = req.body;
  console.log(markets.length)
  const ids = []
  markets.forEach(m => {
    ids.push(m.id)
  });
  Market.destroy({where:{id:ids},returning:true})
  .then(()=>{
    Market.findAll({})
    .then(data=>{
       res.json({msg:`${ids.length} Market(s) Deleted.`,success:true,markets:data})
    })
    .catch(err=>{
      res.json({msg:"Something went wrong. Try refreshin the page",success:false}).status(500)
    })
  })
  .catch(err=>{
    console.log(err)
    res.json({msg:"Something went wrong while deleting market.",success:false}).status(500)
  })
  // console.log(ids)
}

exports.sync=(req,res)=>{
  (async () => {
      let bulk = [];
      const markets = await Market.findAll()

      markets.forEach((market, i) => {

        let data = {
          id: market.id,
          name: market.name,
          images:market.images,
          desc: market.desc,
          category:market.category,
          location: market.location,
        }

        bulk.push({index:{
                _index:"agromallmarket",
                _type:"markets_list",
                _id: market.id
            }
        })

        bulk.push(data)
      });

      client.bulk({body:bulk}, function( error, response  ){
        if( error ){
          console.log(error)
          res.json({msg:error.messages || "Error syncing markets with database", success:false})
        } else {
          console.log(response);
          res.json({msg:'Search results updated, Search will now show newer markets.', success:true})
        }
      });
  })();

}

exports.search=(req,res)=>{
  client.search({
    index: 'agromallmarket',
    type: 'markets_list',
    body: {
      query: {
        // match: { "name": req.query.q }
        bool: {
          must: [
            {
              match: {
                name: req.query.q,
              }
            },
            {
              match: {
                desc: req.query.q,
              }
            },
            {
              match: {
                location: req.query.q,
              }
            }
      },
    }
  }, function (error, response,status) {
    if (error){
      console.log(error)
      res.json({msg:'uhmm, We could not process your search, try again.',success:false}).status(500)
    }
    else {
      res.json({msg:'Search results available',success:true,markets:response.hits.hits})
      console.log(response);
      response.hits.hits.forEach(function(hit){
        console.log(hit);
      })
    }
  });
  // client.ping({
  //   requestTimeout: 30000,
  // }, function (error) {
  //   if (error) {
  //     res.json({msg:'agromall elastic search test falied',success:false,error});
  //   } else {
  //     res.json({msg:'search engin active',success:true});
  //   }
  // });
}