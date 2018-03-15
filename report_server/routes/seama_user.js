var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
    // And insert something like this instead:
    res.json({seamaUser: "fred user"});
});

module.exports = router;
