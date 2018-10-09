const express = require('express');
const Sequelize = require('sequelize');
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const router = express.Router();
const Op = Sequelize.Op;

const db = require('../models');

const userToClient = user => {
	return {
		id: user.id,
		email: user.email,
		username: user.username,
		firstName: user.first_name,
		lastName: user.last_name,
		role: user.roles.map(role => role.authority)
	};
};
/* GET users listing. */
router.get('/', function(req, res) {
	semaLog.info('users - Enter');
	db.user
		.findAll({
			include: [
				{
					model: db.role
				}
			]
		})
		.then(users => {
			let userData = [];
			userData = users.map(user => userToClient(user));
			res.json({ users: userData });
		})
		.catch(err => res.status(500).json({ error: err }));
});

router.post('/', (req, res) => {
	semaLog.info('create user - enter');
	const { username, email, password, firstName, lastName } = req.body;

	db.user
		.findOne({
			where: {
				[Op.or]: [{ email: email }, { username: username }]
			}
		})
		.then(user => {
			if (user) {
				res.status(400).json({
					error: 'Email/username already exists'
				});
			} else {
				db.User.create({
					username,
					email,
					passsword,
					first_name: firstName,
					last_name: lastName
				}).then(user => res.json({ message: 'Success' }));
			}
		})
		.catch(err => res.status(400).json({ error: err }));
});

router.put('/:id', (req, res) => {
	const { username, email, password, firstName, lastName } = req.body;
	db.user
		.update(
			{
				username,
				email,
				password,
				first_name: firstName,
				last_name: lastName
			},
			{
				where: {
					id: req.params.id
				}
			}
		)
		.then(res => res.json(res))
		.catch(err => res.status(500).json({ error: err }));
});

router.delete('/:id', (req, res) => {
	db.user
		.destroy({
			where: {
				id: req.params.id
			}
		})
		.then(res => res.json(res))
		.catch(err => res.status(500).json({ error: err }));
});

module.exports = router;
