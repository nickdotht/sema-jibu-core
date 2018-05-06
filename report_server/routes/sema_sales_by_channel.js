var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connectionTable = require('../seama_services/db_service').connectionTable;

/* GET data for sales_by_channel  */


var sqlSalesByChannel=
	'SELECT sales_channel.id,  sales_channel.name\
	FROM sales_channel';

router.get('/', function(req, response, next) {
	console.log('Sales_by_channel - ', req.query.kioskID);
	var sessData = req.session;
	var connection = connectionTable[sessData.id];
	var results = initResults()
	connection.query(sqlSalesByChannel, [req.query.kioskID], function(err, sqlResult, fields) {
		if( err ){
			console.log( JSON.stringify(err));
			yieldError( response, 500, results );
		}else {
			if (Array.isArray(sqlResult) && sqlResult.length > 0) {
				var salesChannelArray = sqlResult.map(row => {
					return {name: row.name, id: row.id};
				});
				execSqlSalesByChannelQuery(salesChannelArray, 0, connection, req.query, response, results);

			}else{
				yieldResults( response, results );
			}
		}
	});

});
const execSqlSalesByChannelQuery = ( salesChannelArray, index, connection, sqlParams, response, results ) =>{
	let sqlQuery = "";
	let chanelParams =[];
	let sortDesc = true;
	if( sqlParams.hasOwnProperty('firstdate') && sqlParams.hasOwnProperty('lastdate')){
		sortDesc = false;
		sqlQuery = 'SELECT * \
		FROM receipt \
		WHERE receipt.kiosk_id = ? AND receipt.sales_channel_id = ? \
		AND receipt.created_date BETWEEN ? AND ? \
		ORDER BY receipt.created_date';
		chanelParams = [sqlParams.kioskID, salesChannelArray[index].id, new Date(sqlParams.firstdate), new Date(sqlParams.lastdate)];
	}else {
		sqlQuery = 'SELECT * \
		FROM receipt \
		WHERE receipt.kiosk_id = ? AND receipt.sales_channel_id = ? \
		ORDER BY receipt.created_date DESC \
		LIMIT 30';
		chanelParams = [sqlParams.kioskID, salesChannelArray[index].id];
	}
	connection.query(sqlQuery, chanelParams, function(err, sqlResult, fields) {
		if( err ){
			console.log( JSON.stringify(err));
			yieldError( response, 500,results );
		}else{
			if (Array.isArray(sqlResult) && sqlResult.length > 0) {
				// results.salesByChannel.labels.push(salesChannelArray[index].name );
				var salesData = sqlResult.map(row =>{ return {x:row.created_date, y:row.customer_amount}} );
				if( sortDesc ) {
					var salesData = salesData.reverse();
				}

				results.salesByChannel.datasets.push({label:salesChannelArray[index].name, data:salesData});
			}
			index++;
			if( index == salesChannelArray.length ){
				// All done
				yieldResults( response, results );
			}else{
				execSqlSalesByChannelQuery( salesChannelArray, index, connection, sqlParams, response, results);
			}
		}
	});

}
const yieldResults =(response, results ) =>{
	response.json(results);
}

const yieldError = (response, httpErrorCode, results ) =>{
	response.status(httpErrorCode);
	response.json(results);
}
const initResults = () =>{
	return {
		// salesByChannel: { labels: [], datasets: []}
		salesByChannel: { datasets: []}

	}
};



module.exports = router;
