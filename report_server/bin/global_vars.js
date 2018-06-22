/*
 * Set global variables here. Make sure they start
 * with "__"
 */

const path	= require('path');
const mysql	= require('mysql2');
const pe	= require('parse-error');
const env	= process.env.NODE_ENV || 'development';

__basedir	= path.resolve(__dirname, '..');
__dbConfig	= require(`${__basedir}/config/database`)[env];

// Clone the global DB config and add additional options
const configs = {...__dbConfig, connectionLimit: 50, supportBigNumbers: true, decimalNumbers: true};

__pool = mysql.createPool(configs);

__to = promise =>
		promise
		.then(data => [null, data])
		.catch(err => [pe(err)]);

__te = (err_message, log) => { // te stands for Throw Error
	if(log === true){
		console.error(err_message);
	}

	throw new Error(err_message);
}
