const express = require('express');
const router = express.Router();
const { connectionPool } = require(`${__basedir}/seama_services/db_service`);
const semaLog = require(`${__basedir}/seama_services/sema_logger`);

/* GET kiosks in the database. */
router.get('/', function(req, res) {
	semaLog.info('kiosks - Enter');
	connectionPool.getConnection((err, connection) => {
		connection.query('SELECT * FROM kiosk', (err, result ) => {
			connection.release();

			if (err) {
				semaLog.error( 'kiosks - failed', {err});
				res.status(500).send(err.message);
			} else {
				semaLog.info( 'kiosks - succeeded');
				res.json({ kiosks: result });
			}
		});
	});
});

module.exports = router;
