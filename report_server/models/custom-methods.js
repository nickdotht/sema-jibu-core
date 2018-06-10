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
	models.user.prototype.comparePassword = function (pw) {
		return bcrypt.compareSync(pw, this.password);
	};

	// We override the default toJSON so we NEVER send the password
	// to the client
	models.user.prototype.toJSON =  function () {
	  var values = Object.assign({}, this.get());

	  delete values.password;
	  return values;
	};
};
