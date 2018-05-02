var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connectionTable = require('../seama_services/db_service').connectionTable;

/* GET data for sales view. */
const sqlTotalCustomers =
	'SELECT COUNT(*) \
    FROM customer_account \
    WHERE customer_account.kiosk_id = ?';

const sqlTotalRevenue =
	'SELECT SUM(receipt.customer_amount) \
	FROM receipt \
	WHERE receipt.kiosk_id = ?';

var sqlLastSale =
	'SELECT receipt.created_date \
    FROM receipt \
    WHERE receipt.kiosk_id = ? \
    ORDER BY receipt.created_date DESC \
    LIMIT 5';

var sqlPeriodSale =
	'SELECT SUM(receipt.customer_amount) \
    FROM receipt \
    WHERE receipt.kiosk_id = ? AND receipt.created_date BETWEEN ? AND ?';

var sqlRetailers =
	'SELECT * \
	FROM customer_account \
	INNER JOIN sales_channel_customer_accounts \
	ON customer_account.id = sales_channel_customer_accounts.customer_account_id \
	WHERE customer_account.kiosk_id = ?';

router.get('/', function(req, res, next) {
	console.log('Sales - ', req.query.kioskID);
	var sessData = req.session;
	var connection = connectionTable[sessData.id];
	var queryMap =[
		{sqlQuery: sqlTotalCustomers, completeAndNext: getTotalCustomersToTotalRevenue, nextFn:execSqlQuery},
		{sqlQuery: sqlTotalRevenue, completeAndNext: getTotalToRevenueLastSale, nextFn:execSqlQuery},
		{sqlQuery: sqlLastSale, completeAndNext: getLastSaleToLastPeriod, nextFn:execSqlQuery},
		{sqlQuery: sqlPeriodSale, completeAndNext: getLastSalesPeriodToPrevSalesPeriod, nextFn:execSqlQuery},
		{sqlQuery: sqlPeriodSale, completeAndNext: getPrevSalesPeriodToRetailers, nextFn:execSqlQuery},
		{sqlQuery: sqlRetailers, completeAndNext: getRetailersToDone, nextFn:finish}

	];
	execSqlQuery(queryMap, 0, connection, [req.query.kioskID], res, req.query, initResults() );
});

const execSqlQuery =(queryMap, index, connection, sqlParams, response, httpParams, results ) => {
	console.log( "SQL",  queryMap[index]);
	console.log( "Params", [...sqlParams]);
	connection.query(queryMap[index].sqlQuery, sqlParams, function(err, sqlResult, fields) {
		if( err ){
			console.log( JSON.stringify(err));
			yieldResults( res, results );
		}else{
			queryMap[index].completeAndNext( queryMap, index, connection, response, httpParams, results, sqlResult );
		}
	});
}
const getTotalCustomersToTotalRevenue =(queryMap, index, connection, response, httpParams, results, sqlResult ) =>{
	if (Array.isArray(sqlResult) && sqlResult.length >= 1) {
		results.totalCustomers = sqlResult[0]["COUNT(*)"];
	}
	// Set params for TotalRevenue
	queryMap[index].nextFn( queryMap, index+1, connection, [httpParams.kioskID], response, httpParams, results);
}

const getTotalToRevenueLastSale =(queryMap, index, connection, response, httpParams, results, sqlResult ) =>{
	if (Array.isArray(sqlResult) && sqlResult.length >= 1) {
		results.totalRevenue.total = sqlResult[0]["SUM(receipt.customer_amount)"];
		results.totalRevenue.period = httpParams.period;
	}
	// Set params for Last sale
	queryMap[index].nextFn( queryMap, index+1, connection, [httpParams.kioskID], response, httpParams, results);
}

const getLastSaleToLastPeriod =(queryMap, index, connection, response, httpParams, results, sqlResult ) =>{
	var lastDate = null;
	var firstDate = null;
	httpParams.saveFirstDate = firstDate;
	if (Array.isArray(sqlResult) && sqlResult.length >= 1) {
		lastDate = new Date(Date.parse(sqlResult[0].created_date));
		firstDate = calcFirstDate( lastDate, httpParams.period );
		httpParams.saveFirstDate = firstDate;		// Note that this needs to be passed on
	}
	// Set params for next query (if there is a next query)
	queryMap[index].nextFn( queryMap, index+1, connection, [httpParams.kioskID, firstDate, lastDate], response, httpParams, results);
}

const getLastSalesPeriodToPrevSalesPeriod =(queryMap, index, connection, response, httpParams, results, sqlResult ) =>{
	var lastDate = null;
	var firstDate = null;
	if (Array.isArray(sqlResult) && sqlResult.length >= 1) {
		results.totalRevenue.thisPeriod = sqlResult[0]["SUM(receipt.customer_amount)"];
		lastDate = httpParams.saveFirstDate;
		if( lastDate ){
			firstDate = calcFirstDate( lastDate, httpParams.period );
		}
	}
	// Set params for the previous sales period
	queryMap[index].nextFn( queryMap, index+1, connection, [httpParams.kioskID, firstDate, lastDate], response, httpParams, results);
}

const getPrevSalesPeriodToRetailers =(queryMap, index, connection, response, httpParams, results, sqlResult ) =>{
	if (Array.isArray(sqlResult) && sqlResult.length >= 1) {
		results.totalRevenue.lastPeriod = sqlResult[0]["SUM(receipt.customer_amount)"];
	}
	// Set params for the retailers for the kiosk
	queryMap[index].nextFn( queryMap, index+1, connection, [httpParams.kioskID], response, httpParams, results);
}

const getRetailersToDone =(queryMap, index, connection, response, httpParams, results, sqlResult ) =>{
	if (Array.isArray(sqlResult) && sqlResult.length >= 1) {
		let retailers = [];
		sqlResult.forEach( row  =>{
			if( row.gps_coordinates != "") {
				let retailer = {
					name: row.contact_name,
					id: row.id,
					total: "N/A",
					period: httpParams.period,
					thisPeriod: "N/A",
					lastPeriod: "N/A",
					gps: row.gps_coordinates
				}
				retailers.push(retailer);
			}
		});
		results.retailSales = retailers;
	}
	// Set params for next query (if there is a next query)
	queryMap[index].nextFn( queryMap, index+1, connection, [], response, httpParams, results);
}



const finish =(queryMap, index, connection, [], response,  httpParams, results ) =>{
	yieldResults(response, results );
}

const yieldResults =(res, results ) =>{
	res.json(results);
}

const  calcFirstDate = ( lastDate, period ) =>{
	var firstDate = new Date();
	switch( period.toLowerCase()){
		case "month":
		default:
			firstDate.setTime(lastDate.getTime() - (24*60*60*1000) * 30 ) // Back 30 days.
	}
	return firstDate;
}

function initResults() {
	return {
		newCustomers: {period: "N/A", thisPeriod: "N/A", lastPeriod: "N/A"},
		totalRevenue: {total: "N/A", period: "N/A", thisPeriod: "N/A", lastPeriod: "N/A"},
		netIncome: {total: "N/A", period: "N/A", thisPeriod: "N/A", lastPeriod: "N/A"},
		retailSales: [
			{name:"Celine S", id:"abc123", total:9123, period:"month", thisPeriod: 1000, lastPeriod: 1600, gps:"18.59737,-72.32735"},
			{name:"St Piere Tom", id:"def123", total:8233, period:"month", thisPeriod: 1500, lastPeriod: 1400, gps:"18.6035165,-72.2583092"},
			{name:"Stevenson M", id:"defd123", total:6233, period:"month", thisPeriod: 1300, lastPeriod: 1100, gps:"18.82680, -72.55183"},
			{name:"Ysmail Millien", id:"defd123", total:5300, period:"month", thisPeriod: 900, lastPeriod: 10000, gps:"18.72928,-72.41854"}

		],
		totalCustomers: "N/A",
		litersPerCustomer: {period: "N/A", value: "N/A"},
		salesByChannel: { labels: [], datasets: [ { label: "", data: [],},]}

	}
};


module.exports = router;
