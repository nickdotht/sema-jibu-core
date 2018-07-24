const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
const express = require('express');
const router = express.Router();
const semaLog = require('../seama_services/sema_logger');
const bodyParser = require('body-parser');
const Receipt = require('../model_layer/Receipt');

var sqlInsertReceipt = "INSERT INTO receipt " +
				"(uuid, customer_account_id, kiosk_id, created_date, total, sales_channel_id, version, currency_code, is_sponsor_selected, payment_mode, payment_type) " +
				"VALUES (?,?,?,?,?,?,1,'USD',b'0','unknown', 'unknown')";

var sqlInsertReceiptLineItem = "INSERT INTO receipt_line_item " +
				"(product_id, quantity, price, receipt_id, version, currency_code, gallons, sku, type) " +
				"VALUES (?, ?, ?, ?, b'0', 'USD', 0, 'undefined', 'unknown')";





router.post('/', async (req, res) => {
	semaLog.info('CREATE RECEIPT sema_receipts- Enter');
	const { receiptId, customerId,siteId, createdDate, totalSales, cogs, products, salesChannelId} = req.body;
	if( !receiptId || !customerId ||!siteId || !createdDate || !totalSales || !cogs || !products || !salesChannelId ) {
		return res.status(400).send({ msg: "Bad request, missing parts of body. Check documentation" });
	}

	for (let i=0; i < products.length; i++){
		if ( !products[i].productId || !products[i].quantity || !products[i].salesPrice || !products[i].receiptId ) {
			return res.status(400).send({ msg: "Bad request, missing parts of product. Check documentation" });
		}
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
					if (err) {
						semaLog.error('receipts - failed', { err });
						connection.rollback();

							// Use http 'conflict if this is a duplicate
						res.status(err.code === "ER_DUP_ENTRY" ? 409: 500).send(err.message);
						reject(err);
						connection.release();
					}
					else {
						semaLog.info('receipts - succeeded');
						if( receipt.products.length === 0 ){
							commitTransaction(receipt, connection, resolve, reject, res);
						}else {
							let receiptId = result.insertId;
							let successCount = 0;
							let resolveCount = 0;
							for (let i = 0; i < receipt.products.length; i++) {
								let sqlProductParams = [receipt.products[i].productId, receipt.products[i].quantity,
									receipt.products[i].salesPrice, receiptId];
								console.log("Inserting line item #" + i);
								insertReceiptLineItem(sqlInsertReceiptLineItem, sqlProductParams, connection).then(function(result) {
									console.log("Inserted line item #" + resolveCount);
									resolveCount++;
									if (result) {
										successCount++;
									}

									if (resolveCount == receipt.products.length) {
										if (successCount == resolveCount) {
											commitTransaction(receipt, connection, resolve, reject, res);
										} else {
											connection.rollback(function() {
												semaLog.error('receipts - failed', { err });
												res.status(500).send("Error");
												reject(err);
												connection.release();
											});
										}
									}
								})
							}
						}
					}
				});
			});
		})
	});
};

const commitTransaction = ( receipt, connection, resolve, reject, res) => {
	connection.commit(function(err) {
		if (err) {
			connection.rollback(function() {
				semaLog.error('Create receipt - failed', { err });
				res.status(500).send(err.message);
				reject(err);
				connection.release();

			});
		} else {
			connection.release();

		}
		try {
			resolve(res.json(receipt.classToPlain()));
		} catch (err) {
			semaLog.error('receipts - failed', { err });
			res.status(500).send(err.message);
			reject(err);
		}
		console.log('Receipt Transaction Complete.');

	})
}

const insertReceiptLineItem = (query, params, connection) => {
	return new Promise((resolve, reject) => {
		connection.query(query, params, function(err, result) {
			if (err) {
				semaLog.error('insertReceiptLineItem - Failed, err: ' +err.message);
				resolve(false);
			}
			else {
				semaLog.info('insertReceiptLineItem - succeeded');
				semaLog.info(params);
				resolve(true);
			}
		});

	});
};

module.exports = router;
