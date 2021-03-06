const db = require("../models");
const { QueryTypes, Sequelize } = require("sequelize")
const Market = db.markets;
const JWT = require('jsonwebtoken');
const elasticsearch = require('elasticsearch');
const bonsai_url = process.env.BONSAI_URL;
const { v4 } = require('uuid');

// connection to bonsai elastic search server
const client = new elasticsearch.Client({
    hosts: bonsai_url,
    log: 'trace'
});


exports.createNew = (req, res) => {
      Market.create({
          //sending UUID from the front end, so elastic search will have access to thesame uuid on its end
          id:req.body.id,
          name: req.body.name,
          images:req.body.images,
          category:req.body.category,
          desc:req.body.desc,
          location:req.body.location,
          lat:req.body.lat,
          long:req.body.long
        })
      .then(async data=> {
          res.json({msg:'Market data created.',success:true,done:true,data:data});
          const response = await client.update({
            index: 'agromallmarket',
            type: 'markets_list',
            id: req.body.id,  // same is gotten from the frontend will stored here
            body: {
              doc: {
                name: req.body.name,
                images:req.body.images,
                category:req.body.category,
                desc:req.body.desc,
                location:req.body.location
              },
              doc_as_upsert: true
            }
          });
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
    // updates the indexed docs on elasticsearch
    const newdata =  {index:'agromallmarket',type:'markets_list',id:id,
        body:{
            doc:{ name: name, desc: desc, location: location }
        }
    }
    client.update(newdata, function (error, response) {
          client.get({ index: 'agromallmarket', type: 'markets_list', id: id }, function(err, resource) {
            if(error){
                console.log(error)
            }
            if(resource){
                console.log(response)
            }
        })
    });
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
    .then(async data=>{
      await client.deleteByQuery({
        index: "agromallmarket",
        type: "markets_list",
        body: {
          query: {
            terms: {
              _id: ids
            }
          }
        }
      })
      .then(res=>{console.log('deleteed from elasticsearch docs')},
      (err)=>{
        console.log('error occurred while deleting from elasticsearch docs')
        console.log(err)
      })
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
      "query": {
        "multi_match" : {
          "query":    req.query.q, 
          "fields": [ "name", "desc" ],
          "fuzziness": "AUTO" 
        }
      }
    }
  }, function (error, response,status) {
    if (error){
      console.log(error)
      res.json({msg:'uhmm, We could not process your search, try again.',success:false}).status(500)
    }
    else {
      res.json({msg:'Search found',info:`Showing ${response.hits.hits.length} result(s) for`,query:req.query.q,success:true,markets:response.hits.hits})
    };
  }
)
}


  // client.ping({
  //   requestTimeout: 30000,
  // }, function (error) {
  //   if (error) {
  //     res.json({msg:'agromall elastic search test falied',success:false,error});
  //   } else {
  //     res.json({msg:'search engin active',success:true});
  //   }
  // });

