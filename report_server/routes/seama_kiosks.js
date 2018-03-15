var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET users listing. */

router.get('/', function(req, res, next) {
    var con = mysql.createConnection({
        host: "104.131.40.239",
        port: "3306",
        database:"dlo",
        user: "app",
        password: "password"
    });

    con.connect(function(err) {
        if (err) {
            res.status(401).send('Not Auhorized')
        } else {
            console.log("Connected!");
            con.query("SELECT * FROM kiosk", function (err, result, fields) {
                if (err){
                    res.status(401).send('Not Database access')
                }else {
                    console.log(result);
                    res.json({kiosks: result});
                }
            });
        }
    });
});

module.exports = router;
