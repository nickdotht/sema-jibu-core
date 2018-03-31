var express = require('express');
var mysql = require('mysql');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log("health-check");

    testConnection(req, res, next)

});

function testConnection( req, res ){
    var con = mysql.createConnection({
        host: "104.131.40.239",
        port: "3306",
        database: "dlo",
        user: "app",
        password: "password"
    });

    con.connect(function (err) {
        if (err) {
            console.log("Database Connection failed!");
            res.json({
                server: "Ok",
                database: "Failed",
                err: err.toString()
            });
        } else {
            console.log("Database Connected!");
            res.json({
                server: "Ok",
                database: "Ok"
            });
        }
    });
}

module.exports = router;
