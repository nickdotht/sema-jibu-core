// TODO merge with sema-products.js
const express = require('express');
const Sequelize = require('sequelize');
const semaLog = require(`${__basedir}/seama_services/sema_logger`);
const router = express.Router();
const _ = require('lodash');
const Op = Sequelize.Op;
const db = require('../models');

router.get('/', async (req, res) => {
	semaLog.info('/GET products - Enter');

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

router.get('/:id', async (req, res) => {
	semaLog.info('/GET product by id - Enter');
	const productId = req.params.id;

	try {
		let product = await db.product.findOne({ where: { id: productId } });
		res.json({ product: await product.toJSON() });
	} catch (err) {
		semaLog.error(`/GET product by id failed - ${err}`);
		res.status(400).json({
			message: `Failed to /GET product by id ${err}`,
			err: `${err}`
		});
	}
});

module.exports = router;
