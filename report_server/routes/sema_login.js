const express = require('express');
const router = express.Router();
const semaLog = require('../seama_services/sema_logger');
const User = require('../models').user;
const Role = require('../models').role;
const validator = require('validator');
const jwt = require('jsonwebtoken');

/* Process login. */
router.get('/', async (req, res) => {
	semaLog.info('sema_login - Enter');
	const { usernameOrEmail, password } = req.body;
	let whereClause = validator.isEmail(usernameOrEmail) ?
		{ email: usernameOrEmail } :
		{ username: usernameOrEmail };


	try {
		// Get the user without the password attribute
		const user = await User.findOne({
			where: whereClause,
			include: [Role],
			attributes: {
				exclude: ['password']
			}
		});

		if (!user) {
			semaLog.warn('sema_login - Invalid Credentials');
			return res.status(401).send("Invalid Credentials");
		}

		const isValidPassword = await user.comparePassword(password);

		if (!isValidPassword) {
			semaLog.warn('sema_login - Invalid Credentials');
			return res.status(401).send("Invalid Credentials");
		}

		// Everything went well
		const token = jwt.sign(user, process.env.JWT_SECRET, {
			expiresIn: '1 day'
		});

		semaLog.info('sema_login - succeeded');

		res.json({
			LogState: 'LoggedIn',
			version: req.app.get('sema_version'),
			token
		});
	} catch(err) {
		semaLog.warn(`sema_login - Error: ${err}`);
		return res.status(401).send("Something wrong happened");
	}
});

module.exports = router;
