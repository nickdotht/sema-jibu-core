const express = require('express');
const router = express.Router();
const connectionTable = require('../seama_services/db_service').connectionTable;
const sprintf = require('sprintf-js').sprintf;
const customerAccountHasCreatedDate = require('../seama_services/db_service').customerAccountHasCreatedDate;
require('datejs');

// Note: inporting datejs will extend the native Date class

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
	'SELECT   SUM(customer_amount), YEAR(created_date), %s(created_date) \
	FROM      receipt \
	WHERE     kiosk_id=? \
	GROUP BY  YEAR(created_date), %s(created_date) \
	ORDER BY  YEAR(created_date) DESC, %s(created_date) DESC';

const sqlCustomersByPeriod =
	'SELECT   COUNT(id), YEAR(created_date), %s(created_date) \
	FROM      customer_account \
	WHERE     kiosk_id=? \
	GROUP BY  YEAR(created_date), %s(created_date) \
	ORDER BY  YEAR(created_date) DESC, %s(created_date) DESC';

const sqlGallonsPerCustomer =
	'SELECT    SUM(total_gallons), YEAR(created_date), %s(created_date) \
	FROM      receipt \
	WHERE     kiosk_id=?\
	GROUP BY  YEAR(created_date), %s(created_date)\
	ORDER BY  YEAR(created_date) DESC, %s(created_date) DESC';


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
						getGallonsPerCustomer(connection, request.query, results).then(() => {
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
		const sql = sprintf(sqlRevenueByPeriod, requestParams.groupby.toUpperCase(), requestParams.groupby.toUpperCase(), requestParams.groupby.toUpperCase());
		connection.query(sql, [requestParams.kioskID], function (err, sqlResult ) {
			if (err) {
				reject(err);
			} else {
				if (Array.isArray(sqlResult) && sqlResult.length > 0) {
					results.totalRevenue.period1.setValue(sqlResult[0]["SUM(customer_amount)"]);
					let beginDate = new Date(sqlResult[0]["YEAR(created_date)"], sqlResult[0]["MONTH(created_date)"] - 1, 1);
					let endDate = new Date(calcEndOfMonth(beginDate));
					results.totalRevenue.period1.setDates(beginDate, endDate);
				}
				if (Array.isArray(sqlResult) && sqlResult.length > 1) {
					results.totalRevenue.period2.setValue( sqlResult[1]["SUM(customer_amount)"]);
					beginDate = new Date( sqlResult[1]["YEAR(created_date)"], sqlResult[1]["MONTH(created_date)"] -1, 1);
					endDate = new Date( calcEndOfMonth( beginDate));
					results.totalRevenue.period2.setDates( beginDate, endDate );

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
			const sql = sprintf(sqlCustomersByPeriod, requestParams.groupby.toUpperCase(), requestParams.groupby.toUpperCase(), requestParams.groupby.toUpperCase());
			connection.query(sql, [requestParams.kioskID], function (err, sqlResult) {
				if (err) {
					reject(err);
				} else {
					if (Array.isArray(sqlResult) && sqlResult.length > 0) {
						results.newCustomers.period1.setValue( sqlResult[0]["COUNT(id)"]);
						let beginDate = new Date( sqlResult[0]["YEAR(created_date)"], sqlResult[0]["MONTH(created_date)"] -1, 1);
						let  endDate = new Date( calcEndOfMonth( beginDate));
						results.newCustomers.period1.setDates( beginDate, endDate );
					}
					if (Array.isArray(sqlResult) && sqlResult.length > 1) {
						results.newCustomers.period2.setValue( sqlResult[1]["COUNT(id)"]);
						beginDate = new Date( sqlResult[1]["YEAR(created_date)"], sqlResult[1]["MONTH(created_date)"] -1, 1);
						endDate = new Date( calcEndOfMonth( beginDate));
						results.newCustomers.period2.setDates( beginDate, endDate );
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

const getGallonsPerCustomer = (connection, requestParams, results ) => {
	return new Promise((resolve, reject) => {
		results.gallonsPerCustomer.period = requestParams.groupby;
		const sql = sprintf(sqlGallonsPerCustomer, requestParams.groupby.toUpperCase(), requestParams.groupby.toUpperCase(), requestParams.groupby.toUpperCase());
		connection.query(sql, [requestParams.kioskID], function (err, sqlResult ) {
			if (err) {
				reject(err);
			} else {
				if (Array.isArray(sqlResult) && sqlResult.length >= 1) {
					try {
						results.gallonsPerCustomer.value = sqlResult[0]["SUM(total_gallons)"]/ results.totalCustomers;
					}catch( ex ){
						console.error('getGallonsPerCustomer:', error);
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
		let endDate = new Date (Date.now());
		if( requestParams.hasOwnProperty("lastDate")){
			endDate = Date.parse(requestParams.lastDate);
		}
		let beginDate = calcFirstDate( endDate, requestParams.groupby );
		const sql = sprintf(sqlRetailerRevenue, requestParams.groupby.toUpperCase(), requestParams.groupby.toUpperCase(), requestParams.groupby.toUpperCase());
		connection.query(sql, [requestParams.kioskID, beginDate, endDate], function (err, sqlResult) {
			if (err) {
				reject(err);
			} else {
				let index = 0;
				if (Array.isArray(sqlResult) && sqlResult.length > 0) {
					let year = endDate.getFullYear();
					let month = endDate.getMonth() +1 ;	// range 1-12
					while( sqlResult[index]["MONTH(receipt.created_date)"] == month && sqlResult[index]["YEAR(receipt.created_date)"] == year ){
						updateSales(results, sqlResult, index, month, requestParams.groupby, endDate);
						index +=1;
					}
				}
				console.log(index, " Resellers found");
				resolve();
			}
		});
	});
};

const updateSales = ( results, sqlResult, index, month, period, endDate ) => {

	let retailer = {
		name: sqlResult[index]["contact_name"],
		id: sqlResult[index]["customer_account_id"],
		period: period,
		period1: new periodData(),
		period2:  new periodData(),
		period3:  new periodData(),
		gps: sqlResult[index]["gps_coordinates"]
	};

	retailer.period1.setValue( sqlResult[index]["SUM(receipt.customer_amount)"]);

	// NOTE - Period sales is calculated only for months
	let period1EndDate = endDate;
	let period1BeginDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1 );
	retailer.period1.setDates( period1BeginDate, period1EndDate );

	let period2BeginDate = new Date( period1BeginDate)
	period2BeginDate.addMonths(-1);
	let period2EndDate = new Date( calcEndOfMonth( period2BeginDate));

	let period3BeginDate = new Date( period2BeginDate)
	period3BeginDate.addMonths(-1);
	let period3EndDate = new Date( calcEndOfMonth( period3BeginDate));


	index = getPrevPeriodSales( retailer, sqlResult, index+1, period2BeginDate, retailer.period2 );
	if( index != -1 ){
		retailer.period2.setDates( period2BeginDate, period2EndDate );
		index = getPrevPeriodSales( retailer, sqlResult, index+1, period3BeginDate, retailer.period3 );
		if( index != -1 ) {
			retailer.period3.setDates( period3BeginDate, period3EndDate );

		}
	}
	results.retailSales.push( retailer);
};

const getPrevPeriodSales = ( retailer, sqlResult, index, prevDate, nextPeriod, period ) => {
	while( index < sqlResult.length ){
		if( sqlResult[index]["customer_account_id"] == retailer.id &&
			sqlResult[index]["YEAR(receipt.created_date)"] == prevDate.getFullYear() &&
			sqlResult[index]["MONTH(receipt.created_date)"] == (prevDate.getMonth() +1) ){
			nextPeriod.setValue( sqlResult[index]["SUM(receipt.customer_amount)"] );
			return index;
		}
		index +=1;
	}
	return -1;
};

// const updateSalesx = ( retailer_id, retailers, sqlResults ) =>{
// 	let sqlIndex = sqlResults.findIndex(sqlResult => sqlResult.customer_account_id === retailer_id);
// 	const retailerIndex = retailers.findIndex(retailer => retailer.id === retailer_id);
// 	// Sql Index = index into sales result for the retailer, retailerIndex is the object to populate
// 	if(sqlIndex !== -1 &&  retailerIndex !== -1) {
// 		retailers[retailerIndex].total = sqlResults[sqlIndex]["SUM(customer_amount)"];
// 		// Do NOT use current month for trending. It may not be complete.
// 		let nowDate = new Date(Date.now());
// 		if (nowDate.getFullYear() === sqlResults[sqlIndex]["YEAR(receipt.created_date)"] &&
// 			nowDate.getMonth() === sqlResults[sqlIndex]["MONTH(receipt.created_date)"]) {
// 			sqlIndex += 1;
// 		}
// 		if ((sqlIndex + 1) < sqlResults.length && // There must be two or more periods
// 			sqlResults[sqlIndex].customer_account_id === retailer_id &&		// And the next two belong to the this retailer
// 			sqlResults[sqlIndex + 1].customer_account_id === retailer_id) {
// 			retailers[retailerIndex].thisPeriod = sqlResults[sqlIndex]["SUM(customer_amount)"];
// 			retailers[retailerIndex].lastPeriod = sqlResults[sqlIndex+1]["SUM(customer_amount)"];
// 		}
// 	}
// };

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
		newCustomers: {period: "N/A", period1:new periodData(), period2:new periodData()},
		totalRevenue: {total: "N/A", period: "N/A", period1:new periodData(), period2:new periodData()},
		netIncome: {total: "N/A",   period: "N/A",period1:new periodData(), period2:new periodData()},
		retailSales: [],
		totalCustomers: "N/A",
		gallonsPerCustomer: {period: "N/A", value: "N/A"},
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

function periodData () {
	this.beginDate = "N/A";
	this.endDate = "N/A;"
	this.periodValue = "N/A";
	this.setValue = periodValue =>{ this.periodValue = periodValue} ;
	this.setDates = (beginDate, endDate ) => {
		this.endDate = endDate;
		this.beginDate = beginDate;
	};

}

// Return the end of the month
const calcEndOfMonth = (someDate) => {
	return new Date( someDate.getFullYear(), someDate.getMonth(), someDate.getDaysInMonth( someDate.getFullYear(), someDate.getMonth()) );

};

module.exports = router;
