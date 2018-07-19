const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
const express = require('express');
const router = express.Router();
const semaLog = require('../seama_services/sema_logger');
const bodyParser = require('body-parser');
const Receipt = require('../model_layer/Receipt');

var sqlInsertReceipt = "INSERT INTO receipt " +
				"(id, customer_account_id, kiosk_id, created_date, total, sales_channel_id, version, currency_code, is_sponsor_selected, payment_mode, payment_type) " +
				"VALUES (?,?,?,?,?,?,1,'USD',b'0','unknown', 'unknown')";

var sqlInsertReceiptLineItem = "INSERT INTO receipt_line_item " +
				"(product_id, quantity, price, receipt_id, version, currency_code, gallons, sku, type) " +
				"VALUES (?, ?, ?, ?, b'0', 'USD', abc0, 'undefined', 'unknown')";





router.post('/', async (req, res) => {
	semaLog.info('sema_login - Enter');
	const { receiptId, customerId,siteId, createdDate, totalSales, cogs, products, salesChannelId} = req.body;
	if( !receiptId || !customerId ||!siteId || !createdDate || !totalSales || !cogs || !products || !salesChannelId ) {
		return res.status(400).send({ msg: "Bad request, missing parts of body. Check documentation" });
	}

	try {
		let receipt = new Receipt(req.body);
		let postSqlParams = [ receipt.receiptId, receipt.customerId, receipt.siteId,
			receipt.createdDate, receipt.totalSales, receipt.salesChannelId ];
		insertReceipt(receipt, sqlInsertReceipt, postSqlParams, res);
	} catch(err) {
		semaLog.warn(`sema_receipts - Error: ${err}`);
		return res.status(500).send({ msg: "Internal Server Error" });
	}
});

const insertReceipt = (receipt, query, params, res ) => {
	return new Promise((resolve, reject) => {
		__pool.getConnection((err, connection) => {
			connection.beginTransaction(function(err) {
				connection.query(query, params, function(err, result) {
					connection.release();
					if (err) {
						semaLog.error('receipts - failed', { err });
						res.status(500).send(err.message);
						reject(err);
					}
					else {
						semaLog.info('receipts - succeeded');
						let successCount = 0;
						let resolveCount = 0;
						for (let i = 0; i < receipt.products.length; i++) {
							let sqlProductParams = [receipt.products[i].productId, receipt.products[i].quantity,
								receipt.products[i].salesPrice, receipt.products[i].receiptId];

							insertReceiptLineItem(sqlInsertReceiptLineItem, sqlProductParams, res).then(function(result) {
								resolveCount++;
								if (result) {
									successCount++;
								}
								if (resolveCount == receipt.products.length) {
									__pool.getConnection((err, connection) => {
										if (successCount == resolveCount) {
											connection.commit(function(err) {
												if (err) {
													connection.rollback(function() {
														semaLog.error('receipts - failed', { err });
														res.status(500).send(err.message);
														reject(err);
													});
												}
												try {
													resolve(res.json(receipt.classToPlain()));
												} catch (err) {
													semaLog.error('receipts - failed', { err });
													res.status(500).send(err.message);
													reject(err);
												}
												console.log('Transaction Complete.');

											})
										}
										else {
											connection.rollback(function() {
												semaLog.error('receipts - failed', { err });
												res.status(500).send("Error");
												reject(err);
											});
										}
									});
								}
							})
						}
					}
				});
			});
		})
	});
};

const insertReceiptLineItem = (query, params, res) => {
	return new Promise((resolve, reject) => {
		__pool.getConnection((err, connection) => {
			connection.query(query, params, function(err, result) {
				connection.release();
				if (err) {
					semaLog.error('receiptsLineItem - Failed');
					resolve(false);
				}
				else {
					semaLog.info('receiptsLineItem - succeeded');
					resolve(true);
				}
			});

		})
	});
};

module.exports = router;
