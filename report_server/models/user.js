const bcrypt = require('bcrypt');

const user = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'user',
		{
			id: {
				type: DataTypes.BIGINT,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			username: {
				type: DataTypes.STRING(255),
				allowNull: false,
				unique: {
					message: 'Username already exists',
					fields: [sequelize.fn('lower', sequelize.col('username'))]
				}
			},
			email: {
				type: DataTypes.STRING(255),
				allowNull: false,
				unique: {
					args: true,
					msg: 'This email is already taken',
					fields: [sequelize.fn('lower', sequelize.col('email'))]
				},
				validate: {
					isEmail: true
				}
			},
			password: {
				type: DataTypes.STRING(255),
				allowNull: false
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
			},
			first_name: {
				type: DataTypes.STRING(255),
				allowNull: false
			},
			last_name: {
				type: DataTypes.STRING(255),
				allowNull: false
			},
			active: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true
			}
		},
		{
			tableName: 'user',
			timestamps: false,
			underscored: true
		}
	);

	User.beforeCreate(async (user, options) => {
		if (!user.changed('password')) return;

		try {
			// TODO: bcrypt not playing nice with env variable
			let hash = await bcrypt.hash(user.password, 10);
			user.password = hash;
		} catch (err) {
			console.error(err);
		}
	});

	User.prototype.comparePassword = function(pw) {
		return bcrypt.compareSync(pw, this.password);
	};

	User.prototype.toJSON = function() {
		var values = Object.assign({}, this.get());

		delete values.password;
		return values;
	};

	return User;
};

module.exports = user;
