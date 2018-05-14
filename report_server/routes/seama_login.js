const express = require('express');
const router = express.Router();

/* Process login. */
router.get('/', function(req, res) {
	console.log('sema_login');
	let auth = req.header('authorization');
	try {
		auth = auth.substr('Basic '.length);
		auth = Buffer.from(auth, 'base64').toString();
		const credentials = auth.split(':');
		if (
			credentials[0] === 'administrator'.toLowerCase() &&
			credentials[1] === 'dloHaiti'
		)
		{
			res.json({ LogState: 'LoggedIn', version: req.app.get('sema_version')});
		} else {
			res.status(401).send("Invalid Credentials");
		}
	} catch (ex) {
		res.status(400).send("Missing/bad headers");
	}
});

module.exports = router;
