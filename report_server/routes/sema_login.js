const express = require('express');
const router = express.Router();
const semaLog = require('../seama_services/sema_logger');
const User = require('../models').user;
const validator = require('validator');

/* Process login. */
router.get('/', async (req, res) => {
	semaLog.info('sema_login - Enter');
	const { usernameOrEmail, password } = req.body;
	let whereClause = validator.isEmail(usernameOrEmail) ?
		{ email: usernameOrEmail } :
		{ username: usernameOrEmail };

	const [err, user] = await User.findOne({ where: whereClause });

	try {
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
