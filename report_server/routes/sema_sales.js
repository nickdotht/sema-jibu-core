const express = require('express');
const router = express.Router();
const connectionTable = require('../seama_services/db_service').connectionTable;

/* GET data for sales view. */
const sqlTotalCustomers =
	'SELECT COUNT(*) \
    FROM customer_account \
    WHERE customer_account.kiosk_id = ?';

const sqlTotalRevenue =
	'SELECT SUM(customer_amount) \
	FROM receipt \
	WHERE receipt.kiosk_id = ?';

const sqlRevenueByPeriod =
	'SELECT   SUM(customer_amount), created_date \
	FROM      receipt \
	WHERE     kiosk_id=? \
	GROUP BY  YEAR(created_date), MONTH(created_date) \
	ORDER BY DATE(created_date) DESC';

const sqlLitersPerCustomer =
	'SELECT    SUM(total_gallons), COUNT(customer_account_id), created_date \
	FROM      receipt \
	WHERE     kiosk_id=?\
	GROUP BY  YEAR(created_date), MONTH(created_date)\
	ORDER BY DATE(created_date) DESC';

// TODO This query isn't correct. It does NOT resolve retailers
const sqlRetailers =
	'SELECT * \
	FROM customer_account \
	INNER JOIN sales_channel_customer_accounts \
	ON customer_account.id = sales_channel_customer_accounts.customer_account_id \
	WHERE customer_account.kiosk_id = ? AND customer_account.gps_coordinates != ""';

const sqlRetailerRevenue =
	'SELECT SUM(customer_amount), created_date, customer_account_id, customer_account.contact_name \
	FROM receipt \
	INNER JOIN customer_account \
	ON customer_account_id = customer_account.id \
	WHERE customer_account.kiosk_id = ? AND datediff(curdate(), created_date) < 70 AND customer_account_id in( ? )\
	GROUP BY  YEAR(created_date), MONTH(created_date), customer_account_id \
	ORDER BY customer_account_id, created_date DESC';

router.get('/', function(request, response) {
	console.log('Sales - ', request.query.kioskID);
	let sessData = request.session;
	let connection = connectionTable[sessData.id];
	let results = initResults();

	getTotalCustomers(connection, request.query, results).then( () =>{
		getTotalRevenue(connection, request.query, results).then( () => {
			getRevenueByPeriod(connection, request.query, results).then(() => {
				getLitersPerCustomer(connection, request.query, results).then(() => {
					getRetailers(connection, request.query, results).then(() => {
						getRetailerRevenue(connection, request.query, results).then(() => {
							yieldResults(response, results);
						}).catch(err => {
							yieldError(err, response, 500, results);
						})
					}).catch(err => {
						yieldError(err, response, 500, results);
					})
				}).catch(err => {
					yieldError(err, response, 500, results);
				})
			}).catch(err => {
				yieldError(err, response, 500, results);
			})
		}).catch(err => {
			yieldError(err, response, 500, results);
		})
	}).catch( err  => {
		yieldError( err, response, 500, results );
	});

});

const getTotalCustomers = (connection, requestParams, results ) => {
	return new Promise((resolve, reject) => {
		connection.query(sqlTotalCustomers, [requestParams.kioskID], function (err, sqlResult ) {
			if (err) {
				reject(err);
			} else {
				if (Array.isArray(sqlResult) && sqlResult.length >= 1) {
					results.totalCustomers = sqlResult[0]["COUNT(*)"];
				}
				resolve();
			}
		});
	});
};

const getTotalRevenue = (connection, requestParams, results ) => {
	return new Promise((resolve, reject) => {
		connection.query(sqlTotalRevenue, [requestParams.kioskID], function (err, sqlResult ) {
			if (err) {
				reject(err);
			} else {
				if (Array.isArray(sqlResult) && sqlResult.length >= 1) {
					results.totalRevenue.total = sqlResult[0]["SUM(customer_amount)"];
				}
				resolve();
			}
		});
	});
};

const getRevenueByPeriod = (connection, requestParams, results ) => {
	return new Promise((resolve, reject) => {
		results.totalRevenue.period = "month";		// TODO Does this need to be variable
		connection.query(sqlRevenueByPeriod, [requestParams.kioskID], function (err, sqlResult ) {
			if (err) {
				reject(err);
			} else {
				if (Array.isArray(sqlResult) && sqlResult.length > 1) {
					results.totalRevenue.thisPeriod = sqlResult[0]["SUM(customer_amount)"];
					results.totalRevenue.lastPeriod = sqlResult[1]["SUM(customer_amount)"];
				}
				resolve();
			}
		});
	});
};
const getLitersPerCustomer = (connection, requestParams, results ) => {
	return new Promise((resolve, reject) => {
		results.litersPerCustomer.period = "month";		// TODO Does this need to be variable
		connection.query(sqlLitersPerCustomer, [requestParams.kioskID], function (err, sqlResult ) {
			if (err) {
				reject(err);
			} else {
				if (Array.isArray(sqlResult) && sqlResult.length >= 1) {
					try {
						// Convert to liters to gallons
						results.litersPerCustomer.value = (sqlResult[0]["SUM(total_gallons)"] *3.785411784 )/ sqlResult[0]["COUNT(customer_account_id)"];
					}catch( ex ){
						console.error('getLitersPerCustomer:', error);
					}
				}
				resolve();
			}
		});
	});
};


const getRetailers = (connection, requestParams, results ) => {
	return new Promise((resolve, reject) => {
		connection.query(sqlRetailers, [requestParams.kioskID], function (err, sqlResult ) {
			if (err) {
				reject(err);
			} else {
				if (Array.isArray(sqlResult) && sqlResult.length >= 1) {
					let retailers = [];
					let period = (requestParams.period) ? requestParams.period : "month";
					sqlResult.forEach(row => {
						let retailer = {
							name: row.contact_name,
							id: row.id,
							total: "N/A",
							period: period,
							thisPeriod: "N/A",
							lastPeriod: "N/A",
							gps: row.gps_coordinates
						};
						retailers.push(retailer);
					});
					results.retailSales = retailers;
				}
				resolve();
			}
		});
	});
};

const getRetailerRevenue = (connection, requestParams, results ) => {
	return new Promise((resolve, reject) => {
		let inSet = results.retailSales.map(retailer => {return retailer.id});

		connection.query(sqlRetailerRevenue, [requestParams.kioskID, inSet], function (err, sqlResult ) {
			if (err) {
				reject(err);
			} else {
				if (Array.isArray(sqlResult) && sqlResult.length > 0) {
					inSet.forEach(retailerId => {
						updateSales(retailerId, results.retailSales, sqlResult)
					});
				}
				resolve();
			}
		});
	});
};

const updateSales = ( retailer_id, retailers, sqlResults ) =>{
	let sqlIndex = sqlResults.findIndex(sqlResult => sqlResult.customer_account_id === retailer_id);
	const retailerIndex = retailers.findIndex(retailer => retailer.id === retailer_id);
	// Sql Index = index into sales result for the retailer, retailerIndex is the object to populate
	if(sqlIndex !== -1 &&  retailerIndex !== -1) {
		retailers[retailerIndex].total = sqlResults[sqlIndex]["SUM(customer_amount)"];
		// Do NOT use current month for trending. It may not be complete.
		let nowDate = new Date(Date.now());
		if (nowDate.getFullYear() === sqlResults[sqlIndex].created_date.getFullYear() &&
			nowDate.getMonth() === sqlResults[sqlIndex].created_date.getMonth()) {
			sqlIndex += 1;
		}
		if ((sqlIndex + 1) < sqlResults.length && // There must be two or more periods
			sqlResults[sqlIndex].customer_account_id === retailer_id &&		// And the next two belong to the this retailer
			sqlResults[sqlIndex + 1].customer_account_id === retailer_id) {
			retailers[retailerIndex].thisPeriod = sqlResults[sqlIndex]["SUM(customer_amount)"];
			retailers[retailerIndex].lastPeriod = sqlResults[sqlIndex+1]["SUM(customer_amount)"];
		}
	}
};

const yieldResults =(res, results ) =>{
	res.json(results);
};

const yieldError = (err, response, httpErrorCode, results ) =>{
	console.log( "Error:", err.message, "HTTP Error code: ", httpErrorCode);
	response.status(httpErrorCode);
	response.json(results);
};



function initResults() {
	return {
		newCustomers: {period: "N/A", thisPeriod: "N/A", lastPeriod: "N/A"},
		totalRevenue: {total: "N/A", period: "N/A", thisPeriod: "N/A", lastPeriod: "N/A"},
		netIncome: {total: "N/A", period: "N/A", thisPeriod: "N/A", lastPeriod: "N/A"},
		retailSales: [],
		totalCustomers: "N/A",
		litersPerCustomer: {period: "N/A", value: "N/A"},
		salesByChannel: { labels: [], datasets: []}

	}
}


module.exports = router;
