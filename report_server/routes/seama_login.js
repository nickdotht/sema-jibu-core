var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
	console.log('seama_login');
	var auth = req.header('authorization');
	try {
		auth = auth.substr('Basic '.length);
		auth = Buffer.from(auth, 'base64').toString();
		var credentials = auth.split(':');
		if (
			credentials[0] === 'administrator'.toLowerCase() &&
			credentials[1] === 'dloHaiti'
		) {
			res.json({ LogState: 'LoggedIn' });
			// var fooRes = res;
			// setTimeout(function(){
			//     fooRes.json({LogState: "LoggedIn"});
			// }, 3000)
		} else {
			res.json({ LogState: 'BadCredentials' });
		}
	} catch (ex) {
		res.json({ LogState: 'NoService' });
	}
});

module.exports = router;
