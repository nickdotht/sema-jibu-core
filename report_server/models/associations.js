module.exports = models => {
	models.user.belongsToMany(models.role, { through: 'user_role' });
	models.role.belongsToMany(models.user, { through: 'user_role' });
	models.product.belongsTo(models.product_category, {
		foreignKey: 'category_id'
	});
};
