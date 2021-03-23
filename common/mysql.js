const mysql = require('mysql');
const config = require('../config/config');
const mysql_config = config.mysql;

const connection = mysql.createPool(mysql_config);

module.exports = connection;