const path = require('path');
const mysql = require('mysql2');
const env	= process.env.NODE_ENV || 'development';

// Set global variables here. Make sure they start
// with "__"
__basedir	= path.resolve(__dirname, '..');
__dbConfig	= require(`${__basedir}/config/database`)[env];

// Clone the global DB config and add additional options
// (default is 5)
const configs = {...__dbConfig, connectionLimit: 50, supportBigNumbers: true, decimalNumbers: true};
__pool = mysql.createPool(configs);
