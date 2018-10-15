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
				db.user
					.create({
						username,
						email,
						password,
						first_name: firstName,
						last_name: lastName
					})
					.then(user => {
						semaLog.info('Create user success');
						res.json({
							message: 'Create user success',
							user: user.toJSON()
						});
					});
			}
		})
		.catch(err => {
			semaLog.error('Create user - failed', err);
			res.status(400).json({ error: 'Failed to create user' });
		});
});

router.put('/:id', (req, res) => {
	const { username, email, password, firstName, lastName } = req.body;
	db.user
		.find({
			where: {
				id: req.params.id
			}
		})
		.then(user => {
			if (!user) {
				res.status(404).json({
					message: 'User not found'
				});
			}
			user.update({
				username,
				email,
				password,
				first_name: firstName,
				last_name: lastName
			})
				.then(updatedUser =>
					res
						.status(200)
						.json({ message: 'User updated', user: user.toJSON() })
				)
				.catch(err => {
					semaLog.error('Update user failed', err);
					res.status(400).json({ error: err });
				});
		})
		.catch(err => {
			semaLog.error('Update user - find user fail', err);
			res.status(400).json({ error: err });
		});
});

router.delete('/:id', (req, res) => {
	const id = req.params.id;
	db.user
		.find({
			where: { id }
		})
		.then(user => {
			if (!user) {
				res.status(404).json({
					message: 'User not found'
				});
			}

			if (user.active) {
				res.status(400).json({
					message: 'User must be deactivated'
				});
			} else {
				user.destroy()
					.then(() =>
						res.status(200).json({
							message: `User ${id} successfully deleted`,
							id
						})
					)
					.catch(err => {
						semaLog.error('Delete user failed', err);
						res.status(400).json({ error: err });
					});
			}
		})
		.catch(err => {
			semaLog.error('Delete user - user not found');
			res.status(400).json({ error: err });
		});
});

module.exports = router;
