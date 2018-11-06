const bcrypt = require('bcrypt');

module.exports = models => {
	// Will execute everytime a user gets created or modified and the password has been changed
	models.user.beforeSave(async (user, options) => {
		if (!user.changed('password')) return;

		try {
			// TODO: bcrypt not playing nice with env variable
			let hash = await bcrypt.hash(user.password, 10);
			user.password = hash;
		} catch (err) {
			console.error(err);
		}
	});

	// Instance level method: to use when comparing passwords on user login
	models.user.prototype.comparePassword = function(pw) {
		return bcrypt.compareSync(pw, this.password);
	};

	// We override the default toJSON so we NEVER send the password
	// to the client
	models.user.prototype.toJSON = async function() {
		var values = Object.assign({}, this.get());
		delete values.password;
		let role = await this.getRoles();

		return {
			id: values.id,
			email: values.email,
			username: values.username,
			firstName: values.first_name,
			lastName: values.last_name,
			active: values.active,
			role: role.map(r => ({ code: r.code, authority: r.authority }))
		};
	};

	models.product.prototype.toJSON = async function() {
		var values = Object.assign({}, this.get());
		return {
			id: values.id,
			name: values.name,
			sku: values.sku,
			description: values.description,
			category: values.category_id,
			priceAmount: values.price_amount,
			priceCurrency: values.price_currency,
			minQuantity: values.minimum_quantity,
			maxQuantity: values.maximum_quantity,
			unitsPerProduct: values.units_per_product,
			unitMeasurement: values.unit_measurement,
			costOfGoods: values.cogs_amount,
			base64Image: values.base64encoded_image
		};
	};
};
