var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connectionTable = require('../seama_services/db_service').connectionTable;

/* GET users listing. */

router.get('/', function(req, res, next) {
    var mockit = req.app.get('mockIt');
    if( mockit){
        res.json({"kiosks":[{"id":98,"version":0,"api_key":"S21nt2rd","name":"Mock - Saintard","region_id":40},{"id":99,"version":0,"api_key":"C0r21l","name":"Corail","region_id":40},{"id":100,"version":0,"api_key":"Courjo113","name":"Mock - Courjolles","region_id":40},{"id":101,"version":0,"api_key":"C2b2r3t","name":"Cabaret","region_id":40},{"id":102,"version":0,"api_key":"S2nt019","name":"Santo19","region_id":42},{"id":103,"version":0,"api_key":"B01sn3uf","name":"Bois9","region_id":42},{"id":104,"version":0,"api_key":"2u2rt13r","name":"Quartier Morin","region_id":41},{"id":105,"version":0,"api_key":"11m0n2d3","name":"Limonade","region_id":41},{"id":112,"version":0,"api_key":"r40ulspl4c3","name":"Raouls Place","region_id":43},{"id":113,"version":0,"api_key":"k10sk90ua","name":"Ouanaminthe","region_id":41},{"id":114,"version":0,"api_key":"HQ177","name":"HQ","region_id":42}]})
    }else {
        var sessData = req.session;
        var connection = connectionTable[sessData.id]
        connection.query("SELECT * FROM kiosk", function (err, result, fields) {
            if (err) {
                res.status(401).send('No Database access')
            } else {
                res.json({kiosks: result});
            }
        });
    }
});

module.exports = router;

// router.get('/', function(req, res, next) {
//     var mockit = req.app.get('mockIt');
//     if( mockit){
//         res.json({"kiosks":[{"id":98,"version":0,"api_key":"S21nt2rd","name":"Mock - Saintard","region_id":40},{"id":99,"version":0,"api_key":"C0r21l","name":"Corail","region_id":40},{"id":100,"version":0,"api_key":"Courjo113","name":"Mock - Courjolles","region_id":40},{"id":101,"version":0,"api_key":"C2b2r3t","name":"Cabaret","region_id":40},{"id":102,"version":0,"api_key":"S2nt019","name":"Santo19","region_id":42},{"id":103,"version":0,"api_key":"B01sn3uf","name":"Bois9","region_id":42},{"id":104,"version":0,"api_key":"2u2rt13r","name":"Quartier Morin","region_id":41},{"id":105,"version":0,"api_key":"11m0n2d3","name":"Limonade","region_id":41},{"id":112,"version":0,"api_key":"r40ulspl4c3","name":"Raouls Place","region_id":43},{"id":113,"version":0,"api_key":"k10sk90ua","name":"Ouanaminthe","region_id":41},{"id":114,"version":0,"api_key":"HQ177","name":"HQ","region_id":42}]})
//     }else {
//         var con = mysql.createConnection({
//             host: "104.131.40.239",
//             port: "3306",
//             database: "dlo",
//             user: "app",
//             password: "password"
//         });
//
//         con.connect(function (err) {
//             if (err) {
//                 res.status(401).send('Not Auhorized')
//             } else {
//                 console.log("Connected!");
//                 con.query("SELECT * FROM kiosk", function (err, result, fields) {
//                     if (err) {
//                         res.status(401).send('Not Database access')
//                     } else {
//                         res.json({kiosks: result});
//                     }
//                     con.end();
//                     console.log("Disconnected!");
//                 });
//             }
//         });
//     }
// });
