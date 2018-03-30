var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connectionTable = require('../seama_services/db_service').connectionTable;

/* GET users listing. */

router.get('/', function(req, res, next) {
    var mockit = req.app.get('mockIt');
    console.log("kiosk - ", req.query.kioskID);
    if( mockit){
        res.json({"totalProduction":99});
    }else {
        var sessData = req.session;
        var connection = connectionTable[sessData.id];
        getTotalProduction(connection, res, req.query, {});
    }
});

function getTotalProduction(connection, res, params, results) {
    // Notes on constants TBD....
    // 127 parameter is for gallons
    // reading.sampling_site_id = 70 is for PM fill station
    // reading.sampling_site_id = 69 is for fill station (AM??)
    var sql = "SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
        FROM reading \
        INNER JOIN measurement \
        ON reading.id = measurement.reading_id \
        WHERE reading.kiosk_id = ? AND measurement.parameter_id = 127 AND \
        (reading.sampling_site_id = 70 OR reading.sampling_site_id = 69)\
        ORDER BY reading.created_date DESC \
        LIMIT 10";

    connection.query(sql, [params.kioskID], function (err, result, fields) {
        if (err) {
            res.status(401).send('No Database access')
        } else {
            results.totalProduction = "N/A"
            if( Array.isArray(result) && result.length >=2 ) {
                for (var i = 0; i < result.length - 1; i++) {
                    if (result[i].sampling_site_id == 70 && result[i + 1].sampling_site_id == 69) {
                        results.totalProduction =  result[i].value - result[i + 1].value;
                        break;
                    }
                }
            }
            getSitePressure( connection, res, params, results);
        }
     });
}

function getSitePressure(connection, res, params, results) {
    // Notes on constants TBD....
    // 124 parameter membrane feed pressure
    var sql = "SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
        FROM reading \
        INNER JOIN measurement \
        ON reading.id = measurement.reading_id \
        WHERE reading.kiosk_id = ? AND measurement.parameter_id = 124 \
        ORDER BY reading.created_date DESC \
        LIMIT 10";

    connection.query(sql, [params.kioskID], function (err, result, fields) {
        if (err) {
            res.status(401).send('No Database access')
        } else {
            results.sitePressure = "N/A";
            if( Array.isArray(result) && result.length >=1 ) {
                results.sitePressure = result[0].value;
            }
            getFlowRate(connection, res, params, results)
        }
    });
}

function getFlowRate(connection, res, params, results) {
    // Notes on constants TBD....
    // 126 product flow rate
    var sql = "SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
        FROM reading \
        INNER JOIN measurement \
        ON reading.id = measurement.reading_id \
        WHERE reading.kiosk_id = ? AND measurement.parameter_id = 126 \
        ORDER BY reading.created_date DESC \
        LIMIT 10";

    connection.query(sql, [params.kioskID], function (err, result, fields) {
        if (err) {
            res.status(401).send('No Database access')
        } else {
            results.flowRate = "N/A";
            if( Array.isArray(result) && result.length >=1 ) {
                results.flowRate = result[0].value;
            }
            getProduction(connection, res, params, results);
        }
    });
}

function getProduction(connection, res, params, results) {
    // Notes on constants TBD....
    // 127 gallons ??
    var sql = "SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
        FROM reading \
        INNER JOIN measurement \
        ON reading.id = measurement.reading_id \
        WHERE reading.kiosk_id = ? AND measurement.parameter_id = 127 AND reading.sampling_site_id = 70 \
        ORDER BY reading.created_date DESC \
        LIMIT 30";

    connection.query(sql, [params.kioskID], function (err, result, fields) {
        if (err) {
            res.status(401).send('No Database access')
        } else {
             if( Array.isArray(result) && result.length >=1 ) {
                 var timeTicks = result.map(getDate);
                 timeTicks = timeTicks.reverse();
                 var values = result.map(getValue);
                 results.production = {x_axis:timeTicks, datasets:[{label:"Total Production", data:values}]};
                 console.log("getProduction - completed");
            }
            getTotalChlorine(connection, res, params, results);
        }
    });
}

function getTotalChlorine(connection, res, params, results) {
    // Notes on constants TBD....
    // 120 total chlorine ??
    // Site ID = 75 - Water treatment unit
    var sql = "SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
        FROM reading \
        INNER JOIN measurement \
        ON reading.id = measurement.reading_id \
        WHERE reading.kiosk_id = ? AND measurement.parameter_id = 120 AND reading.sampling_site_id = 75 \
        ORDER BY reading.created_date DESC \
        LIMIT 30";

    connection.query(sql, [params.kioskID], function (err, result, fields) {
        if (err) {
            res.status(401).send('No Database access')
        } else {
            if( Array.isArray(result) && result.length >=1 ) {
                var timeTicks = result.map(getDate);
                timeTicks = timeTicks.reverse();
                var values = result.map(getValue);
                results.chlorine = {x_axis:timeTicks, datasets:[{label:"Total Chlorine", data:values}]};
                console.log("getTotalChlorine - completed");
            }
            getTDS(connection, res, params, results);
        }
    });
}

function getTDS(connection, res, params, results) {
    // Notes on constants TBD....
    // 121 Total disolved solids
    // Site ID = 75 - Water treatment unit
    var sql = "SELECT reading.created_date, reading.sampling_site_id, measurement.parameter_id, measurement.value \
        FROM reading \
        INNER JOIN measurement \
        ON reading.id = measurement.reading_id \
        WHERE reading.kiosk_id = ? AND measurement.parameter_id = 121 AND reading.sampling_site_id = 75 \
        ORDER BY reading.created_date DESC \
        LIMIT 30";

    connection.query(sql, [params.kioskID], function (err, result, fields) {
        if (err) {
            res.status(401).send('No Database access')
        } else {
            if( Array.isArray(result) && result.length >=1 ) {
                var timeTicks = result.map(getDate);
                timeTicks = timeTicks.reverse();
                var values = result.map(getValue);
                results.tds = {x_axis:timeTicks, datasets:[{label:"Total Disolved Solids", data:values}]};
                console.log("getTDS - completed");
            }
            res.json(results);
        }
    });
}

function getValue( item, index ){
    return item.value;
}
function getDate( item, index ){
    return item.created_date;
}

module.exports = router;


