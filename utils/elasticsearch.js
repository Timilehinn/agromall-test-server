const db = require("../models");
const Market = db.markets;
const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
    hosts: [ 'http://localhost:9200']
});

// (async () => {
//     let bulk = [];
//     const markets = await Market.findAll()

//     markets.forEach((market, i) => {

//       let data = {
//         id: market.id,
//         name: market.name,
//         desc: market.desc,
//         location: market.location,
//         // description: market.description.replace(/<[^>]*>?/gm, '').replace(/\r?\n|\r/g, " ")
//       }

//       bulk.push({index:{
//               _index:"agromallmarket",
//               _type:"markets_list",
//               _id: market.id
//           }
//       })

//       bulk.push(data)
//     });

//     client.bulk({body:bulk}, function( error, response  ){
//       if( error ){
//         console.log("Failed Bulk operation", error)
//       } else {
//         console.log(response);
//       }
//     });
// })();

client.search({
    index: 'agromallmarket',
    type: 'markets_list',
    body: {
      query: {
        match: { "name": "elastic" }
      },
    }
}, function (error, response,status) {
    if (error){
      console.log(error)
    }
    else {
      console.log(response);
      response.hits.hits.forEach(function(hit){
        console.log(hit);
      })
    }
});
// const newdata =  {index:'agromallmarket',type:'markets_list',id:"65682dd9-d2ea-475f-a04a-8ddde5620044",
//         body:{
//             doc:{
//             name: 'This modified text timi elastic search',
//             }
//         }
//     }
// client.update(newdata, function (error, response) {
    
//     // client.get({ index: 'test', type: 'tes', id: req.params.id }, function(err, resource) {
//     if(error){
//         console.log(error)
//     }
//     if(response){
//         console.log(response)
//     }
// });