const express = require('express');
const router = express.Router();
const semaLog = require('../seama_services/sema_logger');
const uuidv1 = require('uuid/v1');

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


const sqlInsertCustomer = "INSERT INTO customer_account " +
	"(id, address, contact_name, customer_type_id, gps_coordinates, " +
	"kiosk_id, name, phone_number, created_date, updated_date," +
	"gender, version, due_amount) " +
	"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)";



router.post('/', async (req, res) => {
	semaLog.info('sema_customer - Enter');

	var postSqlParams = [];

	req.check("customerType", "Parameter customer-type is missing").exists();
	req.check("contactName", "Parameter contact-name is missing").exists();
	req.check("siteId", "Parameter site-id is missing").exists();

	req.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
			const errors = result.array().map((elem) => {
				return elem.msg;
			});
			console.log("validation error");
			res.status(400).send(errors.toString());
		}
		else {
			console.log("customerType: ", req.query["customerType"]);
			console.log("contactName: ", req.query["contactName"]);
			console.log("siteId: ", req.query["siteId"]);



			if (req.query.hasOwnProperty("customerId"))
				{ postSqlParams.push(req.query["customerId"]); }
			else { postSqlParams.push(uuidv1()); }

			// Required Fields have already been checked


			if (req.query.hasOwnProperty("address"))
				{ postSqlParams.push(req.query["address"]); }
			else { postSqlParams.push(null); }

			postSqlParams.push(req.query["contactName"]);

			postSqlParams.push(req.query["customerType"]);

			if (req.query.hasOwnProperty("gpsCoordinates"))
				{ postSqlParams.push(req.query["gpsCoordinates"]); }
			else { postSqlParams.push(null); }

			postSqlParams.push(req.query["siteId"]);

			if (req.query.hasOwnProperty("Name"))
				{ postSqlParams.push(req.query["Name"]); }
			else { postSqlParams.push(null); }

			if (req.query.hasOwnProperty("phoneNumber"))
				{ postSqlParams.push(req.query["phoneNumber"]); }
			else { postSqlParams.push(null); }

			if (req.query.hasOwnProperty("createdDate"))
				{ postSqlParams.push(new Date(req.query["createdDate"])); }
			else {
				var today = new Date();
				var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
				postSqlParams.push(date);
			}

			if (req.query.hasOwnProperty("updatedDate"))
			{ postSqlParams.push(new Date(req.query["updatedDate"])); }
			else {
				var today = new Date();
				var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
				postSqlParams.push(date);
			}

			if (req.query.hasOwnProperty("gender"))
				{ postSqlParams.push(req.query["gender"]); }
			else { postSqlParams.push(null); }


			console.log(postSqlParams);
			insertCustomers(sqlInsertCustomer, postSqlParams, res).then(function(result) {
				getCustomers();
			});
		}
	});

});

const insertCustomers = (query, params, res ) => {
	return new Promise((resolve, reject) => {
		__pool.getConnection((err, connection) => {

			connection.query(query, params, function(err, result) {
				connection.release();

				if (err) {
					semaLog.error('customers - failed', { err });
					res.status(500).send(err.message);
					reject(err);
				}
				else {
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
				connection.release();

				if (err) {
					semaLog.error('customers - failed', { err });
					res.status(500).send(err.message);
					reject(err);
				}
				else {
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
