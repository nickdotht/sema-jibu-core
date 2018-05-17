const express = require('express');
const router = express.Router();
const semaLog = require('../seama_services/sema_logger');

/* Process login. */
router.get('/', function(req, res) {
	semaLog.info('sema_login - Enter');
	let auth = req.header('authorization');
	try {
		auth = auth.substr('Basic '.length);
		auth = Buffer.from(auth, 'base64').toString();
		const credentials = auth.split(':');
		if (
			credentials[0] === 'administrator'.toLowerCase() &&
			credentials[1] === 'dloHaiti'
		){
			semaLog.info('sema_login - succeeded');
			res.json({ LogState: 'LoggedIn', version: req.app.get('sema_version')});
		} else {
			semaLog.warn('sema_login - Invalid Credentials');
			res.status(401).send("Invalid Credentials");
		}
	} catch (ex) {
		semaLog.error('sema_login - Missing/bad headers');
		res.status(400).send("Missing/bad headers");
	}
});

module.exports = router;
