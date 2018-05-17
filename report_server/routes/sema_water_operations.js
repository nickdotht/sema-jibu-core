const express = require('express');
const router = express.Router();
const connectionTable = require('../seama_services/db_service').connectionTable;
require('datejs');
const semaLog = require('../seama_services/sema_logger');

let parameter_id_map = {};
let sampling_site_id_map = {};

const sqlLMostRecentReading =
	'SELECT created_date FROM reading \
	WHERE kiosk_id = ? \
	ORDER BY created_date DESC \
	LIMIT 2';

const sqlTotalProduction =
	'SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
    FROM reading \
    INNER JOIN measurement \
    ON reading.id = measurement.reading_id \
    WHERE reading.kiosk_id = ? AND measurement.parameter_id = ? AND \
    (reading.sampling_site_id = ? OR reading.sampling_site_id = ?)\
    ORDER BY reading.created_date DESC \
    LIMIT 10';

const sqlSitePressure =
	'SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
    FROM reading \
    INNER JOIN measurement \
    ON reading.id = measurement.reading_id \
    WHERE reading.kiosk_id = ? AND measurement.parameter_id = ? \
    ORDER BY reading.created_date DESC \
    LIMIT 10';

const sqlFlowRate =
	'SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
    FROM reading \
    INNER JOIN measurement \
    ON reading.id = measurement.reading_id \
    WHERE reading.kiosk_id = ? AND measurement.parameter_id = ? \
    ORDER BY reading.created_date DESC \
    LIMIT 10';

const sqlProduction =
	'SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
    FROM reading \
    INNER JOIN measurement \
    ON reading.id = measurement.reading_id \
    WHERE reading.kiosk_id = ? AND measurement.parameter_id = ? AND reading.sampling_site_id = ? \
    AND reading.created_date BETWEEN ? AND ? \
    ORDER BY reading.created_date';

const sqlTotalChlorine =
	'SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
    FROM reading \
    INNER JOIN measurement \
    ON reading.id = measurement.reading_id \
    WHERE reading.kiosk_id = ? AND measurement.parameter_id = ? AND reading.sampling_site_id = ? \
    AND reading.created_date BETWEEN ? AND ? \
    ORDER BY reading.created_date';

const sqlTDS =
	'SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
    FROM reading \
    INNER JOIN measurement \
    ON reading.id = measurement.reading_id \
    WHERE reading.kiosk_id = ? AND measurement.parameter_id = ? AND reading.sampling_site_id = ? \
    AND reading.created_date BETWEEN ? AND ? \
    ORDER BY reading.created_date';

const sqlParameter=
	'SELECT id, name FROM parameter LIMIT 100';

const sqlSamplingSite=
	'SELECT id, name FROM sampling_site LIMIT 100';

/* GET water operations. */

router.get('/', function(request, response) {
	semaLog.info( 'water-operations Entry - kiosk: - ', request.query.kioskID );

	let sessData = request.session;
	let connection = connectionTable[sessData.id];
	let results = initResults();

	request.check("kioskID", "Parameter kioskID is missing").exists();
	request.check("groupby", "Parameter groupby is missing").exists();

	request.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
			const errors = result.array().map((elem) => {
				return elem.msg;
			});
			semaLog.error("water-operations VALIDATION ERROR: ", errors );
			response.status(400).send(errors.toString());
		} else {
			let endDate = null;
			let beginDate = null;
			if (request.query.hasOwnProperty("enddate")) {
				endDate = new Date(Date.parse(request.query.enddate));
			}
			getParametersAndSiteIds(connection ).then( () => {
				getMostRecentReading(connection, request.query, endDate).then((newEndDate) => {
					endDate = newEndDate;
					results.latestDate = endDate;
					beginDate = new Date(newEndDate.getFullYear(), newEndDate.getMonth(), 1);	// 	Default to start of previous month
					beginDate.addMonths(-1);
					getTotalProduction(connection, request.query, results).then(() => {
						getSitePressure(connection, request.query, results).then(() => {
							getFlowRate(connection, request.query, results).then(() => {
								getProduction(connection, request.query, beginDate, endDate, results).then(() => {
									getTotalChlorine(connection, request.query, beginDate, endDate, results).then(() => {
										getTDS(connection, request.query, beginDate, endDate, results).then(() => {
											yieldResults(response, results);
										}).catch(err => {
											yieldError(err, response, 500, results);
										});
									}).catch(err => {
										yieldError(err, response, 500, results);
									});
								}).catch(err => {
									yieldError(err, response, 500, results);
								});
							}).catch(err => {
								yieldError(err, response, 500, results);
							});
						}).catch(err => {
							yieldError(err, response, 500, results);
						});
					}).catch(err => {
						yieldError(err, response, 500, results);
					});
				});
			});
		}
	});
});

function getTotalProduction(connection, params, results) {
	return new Promise((resolve, reject) => {
		// Notes on constants TBD....
		// 127 parameter is for gallons
		// reading.sampling_site_id = 70 is for PM fill station
		// reading.sampling_site_id = 69 is for fill station (AM??)
		const gallonsId = getParameterIdFromMap("Gallons");
		const pmFillStationId = getSamplingSiteIdFromMap("PM: Fill Station");
		const fillStationId = getSamplingSiteIdFromMap("Fill Station");

		connection.query(sqlTotalProduction, [params.kioskID, gallonsId, pmFillStationId, fillStationId], function (err, result) {
			if (err) {
				reject(err);
			} else {
				if (Array.isArray(result) && result.length >= 2) {
					for (let i = 0; i < result.length - 1; i++) {
						if (
							result[i].sampling_site_id === pmFillStationId &&
							result[i + 1].sampling_site_id === fillStationId
						) {
							results.totalProduction = result[i].value - result[i + 1].value;
							break;
						}
					}
				}
				resolve();

			}
		});
	});
}

const getSitePressure = (connection, params, results) =>{
	return new Promise((resolve, reject) => {
		// Notes on constants TBD....
		// 124 parameter membrane feed pressure

		const membraneFeedPressureId = getParameterIdFromMap("MEMBRANE FEED PRESSURE");
		connection.query(sqlSitePressure, [params.kioskID, membraneFeedPressureId], function (err, result) {
			if (err) {
				reject(err);
			} else {
				if (Array.isArray(result) && result.length >= 1) {
					results.sitePressure = result[0].value;
				}
				resolve();
			}
		});
	});
};

const getFlowRate = (connection, params, results) => {
	// Notes on constants TBD....
	// 126 product flow rate
	const productFlowRateId = getParameterIdFromMap("Product Flow Rate");

	return new Promise((resolve, reject) => {
		connection.query(sqlFlowRate, [params.kioskID, productFlowRateId], function (err, result) {
			if (err) {
				reject(err);
			} else {
				results.flowRate = 'N/A';
				if (Array.isArray(result) && result.length >= 1) {
					results.flowRate = result[0].value;
				}
				resolve();
			}
		});
	});
};

function getProduction(connection, params, beginDate, endDate, results) {
	// Notes on constants TBD....
	// 127 gallons ??
	return new Promise((resolve, reject) => {
		const gallonsId = getParameterIdFromMap("Gallons");
		const pmFillStationId = getSamplingSiteIdFromMap("PM: Fill Station");
		connection.query(sqlProduction, [params.kioskID, gallonsId, pmFillStationId, beginDate, endDate], function (err, result ) {
			if (err) {
				reject(err);
			} else {
				try {
					if (Array.isArray(result) && result.length > 0) {
						const timeTicks = result.map(item => {
							return item.created_date;
						});
						const values = result.map(item => {
							return item.value;
						});
						results.production = {
							x_axis: timeTicks,
							datasets: [{label: 'Total Production', data: values}]
						};
					}
					resolve();
				}catch( ex){
					reject( {message:ex.message});
				}
			}
		});
	});
}

function getTotalChlorine(connection, params, beginDate, endDate, results) {
	// Notes on constants TBD....
	// 120 total chlorine ??
	// Site ID = 75 - Water treatment unit
	const totalChlorineId = getParameterIdFromMap("Total Chlorine");
	const waterTreatmentUnitId = getSamplingSiteIdFromMap("Water Treatment Unit");

	return new Promise((resolve, reject) => {
		connection.query(sqlTotalChlorine, [params.kioskID, totalChlorineId, waterTreatmentUnitId, beginDate, endDate], function (err, result) {
			if (err) {
				reject(err);
			} else {
				try {
					if (Array.isArray(result) && result.length >= 1) {
						const timeTicks = result.map(item =>{return item.created_date});
						const values = result.map(item =>{return item.value});
						results.chlorine = {
							x_axis: timeTicks,
							datasets: [{label: 'Total Chlorine', data: values}]
						};
					}
					resolve();
				}catch( ex){
					reject( {message:ex.message});
				}
			}
		});
	});
}

function getTDS(connection, params, beginDate, endDate, results) {
	// Notes on constants TBD....
	// 121 Total disolved solids
	// Site ID = 75 - Water treatment unit
	const totalDissolvedSolidsId = getParameterIdFromMap("Total Dissolved Solids");
	const waterTreatmentUnitId = getSamplingSiteIdFromMap("Water Treatment Unit");

	return new Promise((resolve, reject) => {
		connection.query(sqlTDS, [params.kioskID, totalDissolvedSolidsId, waterTreatmentUnitId, beginDate, endDate], function (err, result) {
			if (err) {
				reject(err);
			} else {
				try {
					if (Array.isArray(result) && result.length >= 1) {
						const timeTicks = result.map(item =>{return item.created_date});
						const values = result.map(item =>{return item.value});
						results.tds = {
							x_axis: timeTicks,
							datasets: [{label: 'TDS', data: values}]
						};
					}
					resolve();
				}catch( ex){
					reject( {message:ex.message});
				}
			}
		});
	});
}

const getMostRecentReading = ( connection, requestParams, endDate ) => {
	return new Promise(( resolve ) => {
		if( endDate != null ){
			resolve( endDate);
		}else{
			connection.query(sqlLMostRecentReading, [requestParams.kioskID], (err, sqlResult )=>{
				if (err) {
					resolve(new Date(Date.now()));
				}else{
					if (Array.isArray(sqlResult) && sqlResult.length > 0) {
						endDate = new Date(sqlResult[0]["created_date"]);
						resolve( endDate );
					}
					resolve(new Date(Date.now()));
				}
			})
		}
	});
};

const getParameterIdFromMap = ( parameter ) =>{
	return (typeof parameter_id_map[parameter] === "undefined" ) ? -1 : parameter_id_map[parameter];
};

const getSamplingSiteIdFromMap = ( parameter ) =>{
	return (typeof sampling_site_id_map[parameter] === "undefined" ) ? -1 : sampling_site_id_map[parameter];
};

const getParametersAndSiteIds = (connection) => {
	return new Promise((resolve ) => {
		if ( Object.keys( parameter_id_map).length === 0 || Object.keys(sampling_site_id_map).length === 0){
			parameter_id_map = {};
			sampling_site_id_map= {};
			connection.query(sqlParameter, (err, sqlResult) => {
				if (err) {
					semaLog.error("water-operations. Error resolving parameter ids ", err );
					resolve();
				} else {
					if (Array.isArray(sqlResult)){
						parameter_id_map = sqlResult.reduce( (map, item) => {
							map[item.name] = item.id;
							return map;
						}, {});
					}
					connection.query(sqlSamplingSite, (err, sqlResult) => {
						if (err) {
							semaLog.error("water-operations. Error resolving sampling site ids ", err );
							resolve();
						}else{
							sampling_site_id_map = sqlResult.reduce( (map, item) => {
								map[item.name] = item.id;
								return map;
							}, {});
						}
						resolve();
					});
				}
			})
		}else{
			resolve();
		}
	});

};

const yieldResults =(res, results ) =>{
	semaLog.info("water-operations - exit");
	res.json(results);
};

const yieldError = (err, response, httpErrorCode, results ) =>{
	semaLog.error("water-operations: ERROR: ", err.message, "HTTP Error code: ", httpErrorCode);
	response.status(httpErrorCode);
	response.json(results);
};

const initResults = () => {
	return {totalProduction: "N/A", sitePressure:"N/A", flowRate:"N/A", latestDate:"N/A",
		production:initEmptyChart(), chlorine:initEmptyChart(), tds:initEmptyChart()};

};
const initEmptyChart = () => {
	return { x_axis: [], datasets: []};
};
module.exports = router;
