const dbConfig = require("../config/dbConfig.js");
require('dotenv').config();
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_port = process.env.DB_PORT;
const db_host = process.env.DB_HOST;
const db_name = process.env.DB_DATABASE;
const Sequelize = require("sequelize");
const local_url = `postgres://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`;
const production_url = process.env.DATABASE_URL || local_url;

const sequelize = new Sequelize(production_url, {
  // host: dbConfig.HOST,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // very important
    }
  },
  dialect: 'postgres',
  logging: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.admin = require("./admin.model.js")(sequelize, Sequelize);
db.markets = require("./market.model.js")(sequelize, Sequelize);
// db.files = require("./file.model.js")(sequelize, Sequelize);

module.exports = db;