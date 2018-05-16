var express = require('express');
var router = express.Router();
const connectionTable = require('../seama_services/db_service').connectionTable;
require('datejs');

/* GET data for sales_by_channel  */


const sqlSalesChannels=
	'SELECT sales_channel.id,  sales_channel.name\
	FROM sales_channel';

const sqlSalesByChannel = 'SELECT * \
		FROM receipt \
		WHERE receipt.kiosk_id = ? AND receipt.sales_channel_id = ? \
		AND receipt.created_date BETWEEN ? AND ? \
		ORDER BY receipt.created_date';


router.get('/', function( request, response ) {
	console.log('Sales_by_channel - ', request.query.kioskID);
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
			console.log("VALIDATION ERROR: ", errors.toString());
			response.status(400).send(errors.toString());
		} else {
			let endDate = null;
			let beginDate = null;

			if (request.query.hasOwnProperty('begindate') && request.query.hasOwnProperty('enddate')) {
				endDate = Date.parse(request.query.enddate);
				beginDate = Date.parse(request.query.begindate);
			} else {
				endDate = new Date(Date.now());
				if (request.query.hasOwnProperty("enddate")) {
					endDate = Date.parse(request.query.enddate);
				}
				beginDate = new Date(endDate.getFullYear(), 0)	// 	Default to start of the year
			}
			results.salesByChannel.beginDate = beginDate;
			results.salesByChannel.endDate = endDate;
			getSalesChannels(connection).then((salesChannel) => {
				execSalesByChannel(salesChannel, 0, connection, request.query.kioskID, beginDate, endDate, response, results);
			}).catch((err) => {
				yieldError(err, response, 500, results);
			});
		}
	});
});

const getSalesChannels = (connection ) => {
	return new Promise((resolve, reject) => {
		connection.query(sqlSalesChannels, function(err, sqlResult ) {
			if( err ){
				reject(err);
			}else {
				if (Array.isArray(sqlResult) && sqlResult.length > 0) {
					let salesChannel = sqlResult.map(row => {
						return {name: row.name, id: row.id};
					});
					resolve(salesChannel);

				}else{
					resolve([]);
				}
			}
		});
	})
};


const execSalesByChannel = ( salesChannelArray, index, connection, kiosk, beginDate, endDate, response, results ) =>{
	connection.query(sqlSalesByChannel, [kiosk, salesChannelArray[index].id, beginDate, endDate], function(err, sqlResult ) {
		if( err ){
			console.log( JSON.stringify(err));
			yieldError( err, response, 500,results );
		}else{
			if (Array.isArray(sqlResult) && sqlResult.length > 0) {
				let salesData = sqlResult.map(row =>{ return {x:row.created_date, y:row.customer_amount}} );

				results.salesByChannel.datasets.push({label:salesChannelArray[index].name, data:salesData});
			}
			index++;
			if( index === salesChannelArray.length ){
				// All done
				yieldResults( response, results );
			}else{
				execSalesByChannel( salesChannelArray, index, connection, kiosk, beginDate, endDate, response, results);
			}
		}
	});
};

const yieldResults =(response, results ) =>{
	response.json(results);
};

const yieldError = (err, response, httpErrorCode, results ) =>{
	console.log( "Error:", err.message, "HTTP Error code: ", httpErrorCode);
	response.status(httpErrorCode);
	response.json(results);
};
const initResults = () =>{
	return {
		// salesByChannel: { labels: [], datasets: []}
		salesByChannel: { beginDate:"N/A", endDate: "N/A", datasets: []}

	}
};



module.exports = router;
