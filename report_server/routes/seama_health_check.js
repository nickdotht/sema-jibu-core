const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const getSQLConfig = require('../seama_services/db_service').getSQLConfig;

/* GET users listing. */
router.get('/', function(req, res, next) {
	console.log('health-check');

	testConnection(req, res, next);
});

function testConnection(req, res) {
	var con = mysql.createConnection(getSQLConfig(req));
	con.connect(function(err) {
		if (err) {
			console.log('Database Connection failed!');
			res.json({
				server: 'Ok',
				database: 'Failed',
				err: err.toString()
			});
		} else {
			console.log('Database Connected!');
			res.json({
				server: 'Ok',
				database: 'Ok'
			});
		}
	});
}

module.exports = router;
