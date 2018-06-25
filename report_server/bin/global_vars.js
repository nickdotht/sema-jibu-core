/*
 * Set global variables here. Make sure they start
 * with "__"
 * IMPORTANT: Always add a brief comment to provide a good reason why you're
 * adding a new GLOBAL variable
 */

const path	= require('path');
const mysql	= require('mysql2');
const pe	= require('parse-error');
const env	= process.env.NODE_ENV || 'development';

// So we can always have an absolute path to the root dir
__basedir	= path.resolve(__dirname, '..');

// Database configurations for different usage accross the app
__dbConfig	= require(`${__basedir}/config/database`)[env];

// Clone the global DB config and add additional options
const configs = {...__dbConfig, connectionLimit: 50, supportBigNumbers: true, decimalNumbers: true};

// The connection pool to use for database calls
__pool = mysql.createPool(configs);

// hp stands for Handle Promise
__hp = promise =>
		promise
		.then(data => [null, data])
		.catch(err => [pe(err)]);

// te stands for Throw Error
__te = (err_message, log) => {
	if(log === true){
		console.error(err_message);
	}

	throw new Error(err_message);
}
