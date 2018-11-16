module.exports = models => {
	models.user.belongsToMany(models.role, { through: 'user_role' });
	models.role.belongsToMany(models.user, { through: 'user_role' });
	models.product.belongsTo(models.product_category, {
		foreignKey: 'category_id'
	});
	models.product.belongsToMany(models.kiosk, { through: 'product_mrp' });
	models.kiosk.belongsToMany(models.product, { through: 'product_mrp' });
};
