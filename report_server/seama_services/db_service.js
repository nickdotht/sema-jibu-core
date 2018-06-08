const mysql = require('mysql2');

// Clone the global DB config and add a greater connection limit
// (default is 5)
const configs = {...__dbConfig, connectionLimit: 50};

module.exports = {
	connectionPool: mysql.createPool(configs);
};
