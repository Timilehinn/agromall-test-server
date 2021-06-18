/* 
    @author: Makinde Timilehin (makiaveli)
*/
require("dotenv").config();
const express = require("express");
const app = express();
const { v4 } = require("uuid");
// remeber to change cors to host
const verifyJWT = require('./utils/verifyJWT')
const PORT = process.env.PORT || 7777;
const cors = require("cors");
const path = require("path");

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(express.json({ limit: "50mb" }));

app.get('/isUserAuth',cors(corsOptions), verifyJWT, (req,res)=>{
  res.json({msg:'you are authorised', authenticated:true})
  console.log('jwt verified')
})

const db = require("./models");
app.use(cors(corsOptions));
// db.sequelize.sync({ force: true }).then(() => {
  // console.log("Drop and re-sync db.");
// });
db.sequelize.sync();
require("./routes/admin.routes.js")(app);
require("./routes/market.routes.js")(app);
app.listen(PORT, () => console.log("server running on port:" + PORT));