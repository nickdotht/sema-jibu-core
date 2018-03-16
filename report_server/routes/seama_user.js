var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var mockit = req.app.get('mockIt')
    console.log("mockit ", mockit)
    if( mockit){
        res.json({seamaUser: "mock user"});
    }else{
        res.json({seamaUser: "fred user"});
    }
});

module.exports = router;
