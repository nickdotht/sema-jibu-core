const express = require('express');
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const router = express.Router();

const userQuery =
	`SELECT a.*, b.role_id, c.authority as role \
	FROM user a \ 
	LEFT JOIN user_role b \
		INNER JOIN role c \
		ON b.role_id = c.id \
	ON a.id = b.user_id`;

/* GET users listing. */
router.get('/', function(req, res ) {
	semaLog.info('users - Enter');
	__pool.getConnection((err, connection) => {
		if (err) {
			console.log("Error: " + err);
			return ;
		}
		connection.query(userQuery, (err, result) => {
			connection.release();
			if (err) {
				semaLog.error('userdb - failed', {err});
				res.status(500).send(err.message);
			} else {
				semaLog.info('userdb - success');
				res.json({users: result.map((user) => {
					return ({
						username: user.username,
						email: user.email,
						firstName: user.first_name,
						lastName: user.last_name,
						role: user.role
					});
				})})
			}
		});
	});
});

module.exports = router;
