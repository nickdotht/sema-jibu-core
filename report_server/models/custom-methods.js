const bcrypt = require('bcrypt');

module.exports = models => {
	// Will execute everytime a user gets created or modified and the password has been changed
	models.user.beforeSave(async (user, options) => {
		if (!user.changed('password')) return;

		try {
			user.password = await bcrypt.hashSync(user.password, process.env.BCRYPT_SALT_ROUNDS);
		} catch (err) {
			console.error(err);
		}
	});

	// Instance level method: to use when comparing passwords on user login
	models.user.prototype.comparePassword = (pw) =>
		bcrypt.compareSync(pw, this.password);
};
