const express = require('express');
const router = express.Router();
const semaLog = require('../seama_services/sema_logger');
const Customer = require('../model_layer/Customer');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

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

const sqlDeleteCustomers = "DELETE FROM customer_account WHERE id = ?";
const sqlGetCustomerById = "SELECT * FROM customer_account WHERE id = ?";

const sqlInsertCustomer = "INSERT INTO customer_account " +
	"(id, address, contact_name, customer_type_id, gps_coordinates, " +
	"kiosk_id, name, phone_number, created_date, updated_date," +
	"gender, version, due_amount) " +
	"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)";

const sqlUpdateCustomers = 	"UPDATE customer_account " +
	"SET address = ?, contact_name = ?, customer_type_id = ?, " +
		"gps_coordinates = ?, name = ?, phone_number = ?, " +
		"updated_date = ?, gender = ?, due_amount = ? " +
	"WHERE id = ?";



router.put('/:id', async (req, res) => {
	semaLog.info('sema_customer - Enter');

	console.log(req.params.id);

	req.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
			const errors = result.array().map((elem) => {
				return elem.msg;
			});
			console.log("validation error");
			res.status(400).send(errors.toString());
		}
		else {
			findCustomers(sqlGetCustomerById, req.params.id).then(function(result) {
					updateCustomers(sqlUpdateCustomers, putLogic(result[0], req.body), res);
			}, function(reason) {
				res.status(404).send("Could not find customer with that id")
			});
		}
	});
});


function putLogic(originalAtts, newAtts) {
	let arr = [];

	if (newAtts.hasOwnProperty("address"))
		arr.push(newAtts["address"]);
	else
		arr.push(originalAtts["address"]);

	if (newAtts.hasOwnProperty("contactName"))
		arr.push(newAtts["contactName"]);
	else
		arr.push(originalAtts["contact_name"]);

	if (newAtts.hasOwnProperty("customerType"))
		arr.push(newAtts["customerType"]);
	else
		arr.push(originalAtts["customer_type_id"]);

	if (newAtts.hasOwnProperty("gpsCoordinates"))
		arr.push(newAtts["gpsCoordinates"]);
	else
		arr.push(originalAtts["gps_coordinates"]);

	if (newAtts.hasOwnProperty("Name"))
		arr.push(newAtts["Name"]);
	else
		arr.push(originalAtts["name"]);

	if (newAtts.hasOwnProperty("phoneNumber"))
		arr.push(newAtts["phoneNumber"]);
	else
		arr.push(originalAtts["phone_number"]);

	if (newAtts.hasOwnProperty("updatedDate"))
		arr.push(newAtts["updatedDate"]);
	else {
		var today = new Date();
		var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
		arr.push(date);
	}

	if (newAtts.hasOwnProperty("gender"))
		arr.push(newAtts["gender"]);
	else
		arr.push(originalAtts["gender"]);

	if (newAtts.hasOwnProperty("dueAmount"))
		arr.push(newAtts["dueAmount"]);
	else
		arr.push(originalAtts["due_amount"]);

	arr.push(originalAtts["id"]);
	return arr;


}



const updateCustomers = (query, params, res ) => {
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
						resolve(res.json({Updated: result}));
					} catch (err) {
						semaLog.error('customers - failed', { err });
						res.status(500).send(err.message);
						reject(err);
					}
				}
			});

		})
	});
};


router.delete('/:id', async (req, res) => {
	semaLog.info('sema_customer - Enter');

	console.log(req.params.id);

	req.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
			const errors = result.array().map((elem) => {
				return elem.msg;
			});
			console.log("validation error");
			res.status(400).send(errors.toString());
		}
		else {
			findCustomers(sqlGetCustomerById, req.params.id).then(function(result) {
				deleteCustomers(sqlDeleteCustomers, req.params.id, res);
			}, function(reason) {
				res.status(404).send("Could not find customer with that id")
			});
		}
	});
});



const findCustomers = (query, params, ) => {
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
						if (Array.isArray(result) && result.length>0) {
							resolve(result);
						}
						else {
							reject(null);
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
};

const deleteCustomers = (query, params, res ) => {
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
						let msg = "Deleted customer with Id " + params.toString();
						resolve(res.status(200).send(msg));
					} catch (err) {
						semaLog.error('customers - failed', { err });
						res.status(500).send(err.message);
						reject(err);
					}

				}
			});

		})
	});
};



router.post('/', async (req, res) => {
	semaLog.info('sema_customer - Enter');

	//var postSqlParams = [];

	console.log(req.body);
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

			console.log("customerType: ", req.body["customerType"]);
			console.log("contactName: ", req.body["contactName"]);
			console.log("siteId: ", req.body["siteId"]);


			let customer = new Customer(req);
			let postSqlParams = [customer.customerId, customer.address, customer.contactName, customer.customerType,
				customer.gpsCoordinates, customer.siteId, customer.Name, customer.phoneNumber,
				customer.createdDate, customer.updatedDate, customer.gender];

			insertCustomers(customer, sqlInsertCustomer, postSqlParams, res);
		}
	});

});

const insertCustomers = (customer, query, params, res ) => {
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
						resolve(res.json(customer.classToPlain()));
					} catch (err) {
						semaLog.error('customers - failed', { err });
						res.status(500).send(err.message);
						reject(err);
					}

				}
			});

		})
	});
};


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
