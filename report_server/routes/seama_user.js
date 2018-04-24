var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	var mockit = req.app.get('mockIt');
	console.log('seama_user - Entry - mockIt ', mockit);

	if (mockit) {
		res.json({ seamaUser: 'mock user' });
	} else {
		res.json({ seamaUser: 'fred user' });
	}
	console.log('seama_user - Exit');
});

module.exports = router;
