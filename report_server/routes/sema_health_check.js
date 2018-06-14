const express = require('express');
const router = express.Router();

const semaLog = require('../seama_services/sema_logger');

router.get('/', (req, res) => {
	semaLog.log('info', 'health-check - Enter');

	__pool.getConnection((err, connection) => {
		connection.release();

		if (err) {
			semaLog.log('error', 'health-check - Failed; database failure');
			semaLog.log('error', err.toString());

			return res.json({
				server: 'Ok',
				database: 'Failed',
				version: req.app.get('sema_version')
			});
		}

		semaLog.log('info', 'health-check - succeeded');

		res.json({
			server: 'Ok',
			database: 'Ok',
			version: req.app.get('sema_version')
		});
	});
});

module.exports = router;
