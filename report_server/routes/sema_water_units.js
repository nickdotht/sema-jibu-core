const express = require('express');
const router = express.Router();
const sprintf = require('sprintf-js').sprintf;
// Note: inporting datejs will extend the native Date class
require('datejs');
const semaLog = require(`${__basedir}/seama_services/sema_logger`);

const sqlWaterUnits = 'SELECT COUNT(id) FROM  product where unit_measure = "gallons"';

router.get('/', async (request, response) => {
	semaLog.info('sema_water_units - Enter');

	__pool.getConnection( (err, connection) => {
		try {
			connection.query(sqlWaterUnits, (err, sqlResult ) => {
				let gallons = (sqlResult[0]["COUNT(id)"]);
				if(gallons === 0 ){
					response.json({waterUnits:"liters"});
				}else{
					response.json({waterUnits:"gallons"});
				}
				connection.release();
			});
		} catch (err) {
			connection.release();
			return __te(err, response, 500, salesSummary);
		}
	});
});


module.exports = router;
