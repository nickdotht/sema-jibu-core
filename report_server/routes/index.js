var express = require('express');
var path    = require("path");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log( "path", path.join(__dirname+'/build/index.html'));
//    res.render('index', { title: 'Express Fred' });
//    res.sendFile(path.join(__dirname+'/build/index.html'));
    res.sendFile('build/index.html');
});

module.exports = router;
