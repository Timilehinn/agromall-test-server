const { Sequelize, Op, Model, DataTypes } = require("sequelize")
const { v4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
    const Market = sequelize.define("market", {
      id:{
        allowNull: false,
        primaryKey: true,
        type: DataTypes.TEXT,
 	      defaultValue: Sequelize.UUIDV4 // incase theres is an issue with uuid from the front end.
      },
      images:{
        type:DataTypes.JSONB, //STORING IMAGES AS BASE46, NOT REALLY EFFECIENT BUT WILL WORK WELL FOR SMALL PROJECTS
        defaultValue:[],
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      desc: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      location:{
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue:[]
      },
    });
    return Market;
  };