const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
const express = require('express');
const router = express.Router();
const semaLog = require('../seama_services/sema_logger');
const bodyParser = require('body-parser');
const Product = require('../model_layer/Product');

var sqlQueryDate = "SELECT * FROM product WHERE updated_at > ? AND active = b'1'";
var sqlQuery = "SELECT * FROM product WHERE active = b'1'";


router.get('/', function(req, res) {
	semaLog.info('customers - Enter');
	if (req.query.hasOwnProperty("updated-date")) {
		getProducts(sqlQueryDate, req.query["updated-date"], res);
	}
	else {
		getProducts(sqlQuery, [], res);
	}
});

const getProducts = (query, params, res ) => {
	__pool.getConnection((err, connection) => {

		connection.query(query, params, function(err, result) {
			connection.release();
			if (err) {
				semaLog.error('products - failed', { err });
				res.status(500).send(err.message);
			}
			else {
				semaLog.info('products - succeeded');
				try {
					if (Array.isArray(result) && result.length >= 1) {

						var values = result.map(item => {
							product = new Product(item);
							return product.classToPlain(item);
						});

						//let m = new Product(result);
						res.json({ products: values});
					} else {
						res.json({ products: [] });
					}

				} catch (err) {
					semaLog.error('products - failed', { err });
					res.status(500).send(err.message);
				}
			}
		});

	})
}


module.exports = router;
