const { Sequelize, Op, Model, DataTypes } = require("sequelize")
const { v4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define("admin", {
      id:{
        allowNull: false,
        primaryKey: true,
        type: DataTypes.TEXT,
 	      defaultValue: Sequelize.UUIDV4
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
      fullname: {
        type: DataTypes.TEXT,
        defaultValue:''
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false
      },
    });
    return Admin;
  };