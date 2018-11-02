const express = require('express');
const Sequelize = require('sequelize');
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const router = express.Router();
const _ = require('lodash');
const Op = Sequelize.Op;
const db = require('../models');

router.get('/', async (req, res) => {
	semaLog.info('GET products - Enter');

	try {
		let products = await db.product.findAll();
		let productData = await Promise.all(
			products.map(async product => await product.toJSON())
		);
		res.json({ products: productData });
	} catch (err) {
		semaLog.error(`GET products failed - ${err}`);
		res.status(400).json({
			message: `Failed to GET products ${err}`,
			err: `${err}`
		});
	}
});

module.exports = router;
