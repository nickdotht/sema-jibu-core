const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const getSQLConfig = require('../seama_services/db_service').getSQLConfig;

const semaLog = require('../seama_services/sema_logger');

/* GET users listing. */
router.get('/', function(req, res ) {
	semaLog.log('info', 'health-check - Enter');

	const con = mysql.createConnection(getSQLConfig(req));
	con.connect(function(err) {
		if (err) {
			semaLog.log('error', 'health-check - Failed; database failure');
			res.json({
				server: 'Ok',
				database: 'Failed',
				version: req.app.get('sema_version'),
				err: err.toString()
			});
		} else {
			semaLog.log('info', 'health-check - succeeded');
			res.json({
				server: 'Ok',
				database: 'Ok',
				version: req.app.get('sema_version')
			});
		}
	});
});

module.exports = router;
