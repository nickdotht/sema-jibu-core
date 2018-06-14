const express = require('express');
const router = express.Router();
const semaLog = require('../seama_services/sema_logger');

/* GET customers in the database. */

var attsToGrab = ["id", "address", "contact_name", "customer_type_id",
	"due_amount", "gps_coordinates", "kiosk_id", "name", "phone_number",
	"created_date", "gender", "updated_date"];

const sqlSiteIdOnly = "SELECT * " +
	"FROM customer_account " +
	"WHERE kiosk_id = ?";
const sqlBeginDateOnly = "SELECT * " +
	"FROM customer_account " +
	"WHERE kiosk_id = ? " +
	"AND created_date >= ?";
const sqlEndDateOnly = "SELECT * " +
	"FROM customer_account " +
	"WHERE kiosk_id = ? " +
	"AND created_date <= ?";
const sqlBeginEndDate = "SELECT * " +
	"FROM customer_account " +
	"WHERE kiosk_id = ? " +
	"AND created_date BETWEEN ? AND ?";
const sqlUpdatedDate = "SELECT * " +
	"FROM customer_account " +
	"WHERE kiosk_id = ? " +
	"AND updated_date > ?";
//const sqlLastUpdated = "SELECT * FROM customer_account WHERE kiosk_id = ? AND ";

//SELECT * FROM customer_account WHERE kiosk_id = 2 AND created_date >= "2000-01-01 01:01:01"'



router.get('/', function(req, res) {
	semaLog.info('customers - Enter');

	// const sessData = req.session;
	// const connection = connectionTable[sessData.id];

	//let results = initResults();
	req.check("site-id", "Parameter site-id is missing").exists();

	console.log("LOG - Site-id: " + req.query['site-id']);

	req.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
			const errors = result.array().map((elem) => {
				return elem.msg;
			});
			semaLog.error("site-id VALIDATION ERROR: ", errors);
			res.status(400).send(errors.toString());
		}
		else {
			if (req.query.hasOwnProperty("updated-date")) {
				let updatedDate = new Date(req.query["updated-date"]);
				if (!isNaN(updatedDate)) {
					getCustomers( sqlUpdatedDate,
						[req.query["site-id"], updatedDate], res);
				}
				else {
					res.status(400).send("Invalid Date");
				}
			}
			else if (req.query.hasOwnProperty("begin-date") && req.query.hasOwnProperty("end-date")) {
				let beginDate = new Date(req.query["begin-date"]);
				let endDate = new Date(req.query["end-date"]);
				if (!isNaN(beginDate) && !isNaN(endDate)) {
					getCustomers( sqlBeginEndDate,
						[req.query["site-id"], beginDate, endDate], res);
				}
				else {
					res.status(400).send("Invalid Date");
				}
			}
			else if (req.query.hasOwnProperty("begin-date")) {
				let beginDate = new Date(req.query["begin-date"]);
				if (!isNaN(beginDate)) {
					getCustomers( sqlBeginDateOnly,
						[req.query["site-id"], beginDate], res);
				}
				else {
					res.status(400).send("Invalid Date");
				}
			}
			else if (req.query.hasOwnProperty("end-date")) {
				let endDate = new Date(req.query["end-date"]);
				if (!isNaN(endDate)) {
					getCustomers( sqlEndDateOnly,
						[req.query["site-id"], endDate], res);
				}
				else {
					res.status(400).send("Invalid Date");
				}
			}
			else {
				getCustomers( sqlSiteIdOnly, [req.query["site-id"]], res);
			}

		}
	});
});

const getCustomers = (query, params, res ) => {
	return new Promise((resolve, reject) => {
		__pool.getConnection((err, connection) => {

			connection.query(query, params, function(err, result) {
				if (err) {
					semaLog.error('customers - failed', { err });
					res.status(500).send(err.message);
					connection.release();
					reject(err);
				}
				else {
					connection.release();
					semaLog.info('customers - succeeded');

					try {
						if (Array.isArray(result) && result.length >= 1) {
							const values = result.map(item => {
								const toKeep = {};

								for (let i = 0; i < attsToGrab.length; i++) {
									toKeep[attsToGrab[i]] = item[attsToGrab[i]];
								}
								return toKeep;
							});
							resolve(res.json({ customers: values }));
						} else {
							resolve(res.json({ customers: [] }));
						}


					} catch (err) {
						semaLog.error('customers - failed', { err });
						res.status(500).send(err.message);
						reject(err);
					}
				}
			});

		})
	});
}


module.exports = router;
