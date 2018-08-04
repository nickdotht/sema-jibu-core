const express = require('express');
const router = express.Router();
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const ProductMrp = require('../model_layer/ProductMrp');

var sqlQuery = "SELECT * FROM product_mrp WHERE kiosk_id = ?";

router.get('/', function(req, res) {
	semaLog.info('GET product mrps - Enter');
	req.check("site-id", "Parameter site-id is missing").exists();
	req.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
			const errors = result.array().map((elem) => {
				return elem.msg;
			});
			semaLog.error("GET product mrps: validation error: ", errors);
			res.status(400).send(errors.toString());
		}else{
			__pool.getConnection((err, connection) => {

				connection.query(sqlQuery, [req.query["site-id"]], (err, result) => {
					connection.release();
					if (err) {
						semaLog.error('GET product mrps  - failed', { err });
						res.status(500).send(err.message);
					} else {
						semaLog.info('GET product mrps  - succeeded');
						res.json({
							productMRPs: result.map((productMrp) => {
								return (new ProductMrp(productMrp)).classToPlain()
							})
						});
					}
				});
			});
		}
	});
});

module.exports = router;
