const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
const express = require('express');
const router = express.Router();
const semaLog = require('../seama_services/sema_logger');
const bodyParser = require('body-parser');
const Receipt = require('../model_layer/Receipt');

var sqlInsert = "INSERT INTO receipt " +
				"(id, customer_account_id, kiosk_id, created_date, total, sales_channel_id, version, currency_code, is_sponsor_selected, payment_mode, payment_type) " +
				"VALUES (?,?,?,?,?,?,1,'USD',b'0','unknown', 'unknown')";



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
		insertReceipt(receipt, sqlInsert, postSqlParams, res);
	} catch(err) {
		semaLog.warn(`sema_receipts - Error: ${err}`);
		return res.status(500).send({ msg: "Internal Server Error" });
	}
});

const insertReceipt = (receipt, query, params, res ) => {
	return new Promise((resolve, reject) => {
		__pool.getConnection((err, connection) => {
			connection.query(query, params, function(err, result) {
				connection.release();
				if (err) {
					semaLog.error('receipts - failed', { err });
					res.status(500).send(err.message);
					reject(err);
				}
				else {
					semaLog.info('receipts - succeeded');

					try {
						resolve(res.json(receipt.classToPlain()));
					} catch (err) {
						semaLog.error('receipts - failed', { err });
						res.status(500).send(err.message);
						reject(err);
					}

				}
			});

		})
	});
};

module.exports = router;
