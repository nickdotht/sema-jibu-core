const express = require('express');
const router = express.Router();
const connectionTable = require('../seama_services/db_service').connectionTable;
const sprintf = require('sprintf-js').sprintf;
const customerAccountHasCreatedDate = require('../seama_services/db_service').customerAccountHasCreatedDate;

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
	'SELECT   SUM(customer_amount), DATE(created_date) \
	FROM      receipt \
	WHERE     kiosk_id=? \
	GROUP BY  DATE(created_date), %s(created_date) \
	ORDER BY  DATE(created_date) DESC';

const sqlCustomersByPeriod =
	'SELECT   COUNT(id), DATE(created_date), %s(created_date) \
	FROM      customer_account \
	WHERE     kiosk_id=? \
	GROUP BY  DATE(created_date), %s(created_date) \
	ORDER BY  DATE(created_date) DESC';

const sqlLitersPerCustomer =
	'SELECT    SUM(total_gallons), COUNT(customer_account_id), DATE(created_date) \
	FROM      receipt \
	WHERE     kiosk_id=?\
	GROUP BY  DATE(created_date), MONTH(created_date)\
	ORDER BY  DATE(created_date) DESC';

// TODO This query isn't correct. It does NOT resolve retailers
const sqlRetailers =
	'SELECT * \
	FROM customer_account \
	INNER JOIN sales_channel_customer_accounts \
	ON customer_account.id = sales_channel_customer_accounts.customer_account_id \
	WHERE customer_account.kiosk_id = ? AND customer_account.gps_coordinates != ""';

const sqlRetailerRevenueOld =
	'SELECT SUM(customer_amount), YEAR(receipt.created_date), %s(receipt.created_date),  customer_account_id, customer_account.contact_name \
	FROM receipt \
	INNER JOIN customer_account \
	ON customer_account_id = customer_account.id \
	WHERE customer_account.kiosk_id = ? AND datediff(curdate(), receipt.created_date) < 70 AND customer_account_id in( ? )\
	GROUP BY  YEAR(receipt.created_date), %s(receipt.created_date), customer_account_id \
	ORDER BY customer_account_id, YEAR(receipt.created_date) DESC';

const sqlRetailerRevenue =
	'SELECT SUM(receipt.customer_amount), YEAR(receipt.created_date), %s(receipt.created_date), \ \
	 receipt.customer_account_id, customer_account.contact_name, customer_account.gps_coordinates \
	FROM receipt \
	INNER JOIN customer_account \
	ON customer_account_id = customer_account.id \
	WHERE receipt.kiosk_id = ? AND receipt.created_date BETWEEN ? AND ? \
	GROUP BY YEAR(receipt.created_date), %s(receipt.created_date), receipt.customer_account_id \
	ORDER BY YEAR(receipt.created_date) DESC, %s(receipt.created_date)  DESC, SUM(receipt.customer_amount) DESC';

router.get('/', function(request, response) {
	console.log('Sales - ', request.query.kioskID);
	let sessData = request.session;
	let connection = connectionTable[sessData.id];
	let results = initResults();

	request.check("kioskID", "Parameter kioskID is missing").exists();
	request.check("groupby", "Parameter groupby is missing").exists();

	request.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
			var errors = result.array().map((elem) => {
				return elem.msg;
			});
			console.log("VALIDATION ERROR: ",errors.toString());
			response.status(400).send(errors.toString());
		} else {
			getTotalCustomers(connection, request.query, results).then(() => {
				getTotalRevenue(connection, request.query, results).then(() => {
					getRevenueByPeriod(connection, request.query, results).then(() => {
						getLitersPerCustomer(connection, request.query, results).then(() => {
							getCustomersByPeriod(connection, request.query, results).then(() => {
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
			}).catch(err => {
				yieldError(err, response, 500, results);
			});
		}
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
					if( results.totalRevenue.total === null ){
						results.totalRevenue.total = "N/A";
					}
				}
				resolve();
			}
		});
	});
};

const getRevenueByPeriod = (connection, requestParams, results ) => {
	return new Promise((resolve, reject) => {
		results.totalRevenue.period = requestParams.groupby;
		const sql = sprintf(sqlRevenueByPeriod, requestParams.groupby.toUpperCase());
		connection.query(sql, [requestParams.kioskID], function (err, sqlResult ) {
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

const getCustomersByPeriod = (connection, requestParams, results ) => {
	return new Promise((resolve, reject) => {
		if (customerAccountHasCreatedDate()) {
			results.newCustomers.period = requestParams.groupby;
			const sql = sprintf(sqlCustomersByPeriod, requestParams.groupby.toUpperCase(), requestParams.groupby.toUpperCase());
			connection.query(sql, [requestParams.kioskID], function (err, sqlResult) {
				if (err) {
					reject(err);
				} else {
					if (Array.isArray(sqlResult) && sqlResult.length > 1) {
						results.newCustomers.thisPeriod = sqlResult[0]["COUNT(id)"];
						results.newCustomers.lastPeriod = sqlResult[1]["COUNT(id)"];
					}
					resolve();
				}
			});
		}else{
			// Database schema doesn't have created_date for customer accounts
			resolve();
		}
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
						// Value is in galleons
						results.litersPerCustomer.value = sqlResult[0]["SUM(total_gallons)"]/ sqlResult[0]["COUNT(customer_account_id)"];
					}catch( ex ){
						console.error('getLitersPerCustomer:', error);
					}
				}
				resolve();
			}
		});
	});
};


// const getRetailers = (connection, requestParams, results ) => {
// 	return new Promise((resolve, reject) => {
// 		connection.query(sqlRetailers, [requestParams.kioskID], function (err, sqlResult ) {
// 			if (err) {
// 				reject(err);
// 			} else {
// 				if (Array.isArray(sqlResult) && sqlResult.length >= 1) {
// 					let retailers = [];
// 					let period = (requestParams.period) ? requestParams.period : "month";
// 					sqlResult.forEach(row => {
// 						let retailer = {
// 							name: row.contact_name,
// 							id: row.id,
// 							total: "N/A",
// 							period: period,
// 							thisPeriod: "N/A",
// 							lastPeriod: "N/A",
// 							gps: row.gps_coordinates
// 						};
// 						retailers.push(retailer);
// 					});
// 					results.retailSales = retailers;
// 				}
// 				resolve();
// 			}
// 		});
// 	});
// };

const getRetailerRevenue = (connection, requestParams, results ) => {
	return new Promise((resolve, reject) => {
		let lastDate = new Date (Date.now());
		if( requestParams.hasOwnProperty("lastDate")){
			lastDate = Date.parse(requestParams.lastDate);
		}
		let firstDate = calcFirstDate( lastDate, requestParams.groupby );
		const sql = sprintf(sqlRetailerRevenue, requestParams.groupby.toUpperCase(), requestParams.groupby.toUpperCase(), requestParams.groupby.toUpperCase());
		connection.query(sql, [requestParams.kioskID, firstDate, lastDate], function (err, sqlResult) {
			if (err) {
				reject(err);
			} else {
				let index = 0;
				if (Array.isArray(sqlResult) && sqlResult.length > 0) {
					let year = lastDate.getFullYear();
					let month = lastDate.getMonth() +1 ;	// range 1-12
					while( sqlResult[index]["MONTH(receipt.created_date)"] == month && sqlResult[index]["YEAR(receipt.created_date)"] == year ){
						updateSales(results, sqlResult, index, month, requestParams.groupby);
						index +=1;
					}
				}
				console.log(index, " Resellers found");
				resolve();
			}
		});
	});
};

const updateSales = ( results, sqlResult, index, month, period ) => {

	let retailer = {
		name: sqlResult[index]["contact_name"],
		id: sqlResult[index]["customer_account_id"],
		total: sqlResult[index]["SUM(receipt.customer_amount)"],
		period: period,
		thisPeriod: 0,
		lastPeriod: 0,
		gps: sqlResult[index]["gps_coordinates"]
	};

	// TODO - This will break across years. E.g month => -1
	// Find the previous two periods
	index = getPrevPeriodSales( retailer, sqlResult, index+1, month-1, "thisPeriod" )
	if( index != -1 ){
		index = getPrevPeriodSales( retailer, sqlResult, index+1, month-2, "lastPeriod" )

	}
	results.retailSales.push( retailer);
};
// TODO - Years should be in this....
const getPrevPeriodSales = ( retailer, sqlResult, index, month, property ) => {
	while( index < sqlResult.length ){
		if( sqlResult[index]["customer_account_id"] == retailer.id && sqlResult[index]["MONTH(receipt.created_date)"] == month ){
			retailer[property] = sqlResult[index]["SUM(receipt.customer_amount)"];
			return index;
		}
		index +=1;
	}
	return -1;
};

const updateSalesx = ( retailer_id, retailers, sqlResults ) =>{
	let sqlIndex = sqlResults.findIndex(sqlResult => sqlResult.customer_account_id === retailer_id);
	const retailerIndex = retailers.findIndex(retailer => retailer.id === retailer_id);
	// Sql Index = index into sales result for the retailer, retailerIndex is the object to populate
	if(sqlIndex !== -1 &&  retailerIndex !== -1) {
		retailers[retailerIndex].total = sqlResults[sqlIndex]["SUM(customer_amount)"];
		// Do NOT use current month for trending. It may not be complete.
		let nowDate = new Date(Date.now());
		if (nowDate.getFullYear() === sqlResults[sqlIndex]["YEAR(receipt.created_date)"] &&
			nowDate.getMonth() === sqlResults[sqlIndex]["MONTH(receipt.created_date)"]) {
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
};

// Calculate the date for the three periods that include lastDate, lastDate -1 and lastDate -2.
// Example for the monthly period; if the current date is June 6 2018, then the
// previous three periods are April, May and June and the first Date is April 1, 2018
const calcFirstDate = ( lastDate, period ) =>{
	switch( period ){
		case 'month':
		default:
			let year = lastDate.getFullYear();
			let month = lastDate.getMonth();
			for( let i = 0; i < 2; i++){
				// Note month range is 0->11
				if( month == 0 ){
					month = 11;
					year -= 1;
				}else{
					month -= 1;
				}
			}
			return new Date(year, month,1 )

	}
};

module.exports = router;
