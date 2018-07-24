const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const sprintf = require('sprintf-js').sprintf;
var findKioskId = require('./Utilities/findKioskId');
var authenticate = require('./Utilities/authenticate');
var findSalesByChannelId = require('./Utilities/findSalesByChannelId');
var removeReceipts = require('./Utilities/removeReceipts');
var getReceipts = require('./Utilities/getReceipts');
const uuidv1 = require('uuid/v1');

describe('Testing Receipts API', function () {
	let server;
	this.timeout(6000);
	beforeEach((done) => {
		var iAmDone = done;
		server = require('../bin/www');
		setTimeout(function() {
			iAmDone()
		}, 1500);
	});
	afterEach((done) => {
		var iAmDone = done;
		server.close();
		setTimeout(function() {
			iAmDone()
		}, 2000);
	});

	describe('POST /sema/site/receipts. Everything Valid', function() {
		it('Should pass', (done) => {
			authenticate(server).then(function(token) {
				removeReceipts.removeReceiptLineItems().then(function() {
					removeReceipts.removeReceipts().then(function() {
						findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
							let url = '/sema/site/receipts/';
							chai.request(server)
								.post(url)
								.set('Content-Type', 'application/json; charset=UTF-8')
								.send({
									"receiptId": "2",
									"customerId": "Brian",
									"siteId": kiosk.id,
									"createdDate": "9/9/18",
									"totalSales": "10",
									"cogs": "9",
									"products": [
										{
											"productId": "558",
											"quantity": "1",
											"salesPrice": "1",
											"receiptId": "2"
										},
										{
											"productId": "559",
											"quantity": "1",
											"salesPrice": "2",
											"receiptId": "2"
										}
									],
									"salesChannelId": "122"
								})
								.set('Authorization', token)
								.end(function(err, res) {
									res.should.have.status(200);
									getReceipts.getReceipts().then(function(receipts) {
										receipts[0].should.have.property("uuid").eql("2");
										getReceipts.getReceiptLineItems().then(function(receiptLineItems) {
											receiptLineItems[0].should.have.property("price").eql(1);
											receiptLineItems[1].should.have.property("price").eql(2);
											removeReceipts.removeReceiptLineItems().then(function() {
												removeReceipts.removeReceipts().then(function() {
													done(err);
												});
											});
										});
									});

								});
						});
					});
				});
			});
		});
	});


	describe('POST /sema/site/receipts. No Products', function() {
		it('Should pass', (done) => {
			authenticate(server).then(function(token) {
				removeReceipts.removeReceiptLineItems().then(function() {
					removeReceipts.removeReceipts().then(function() {
						findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
							let url = '/sema/site/receipts/';
							chai.request(server)
								.post(url)
								.set('Content-Type', 'application/json; charset=UTF-8')
								.send({
									"receiptId": "2",
									"customerId": "Brian",
									"siteId": kiosk.id,
									"createdDate": "9/9/18",
									"totalSales": "10",
									"cogs": "9",
									"salesChannelId": "122"
								})
								.set('Authorization', token)
								.end(function(err, res) {
									res.should.have.status(400);
									done(err);
								});
						});
					});
				});
			});
		});
	});

	describe('POST /sema/site/receipts. Missing product attributes.', function() {
		it('Should pass', (done) => {
			authenticate(server).then(function(token) {
				removeReceipts.removeReceiptLineItems().then(function() {
					removeReceipts.removeReceipts().then(function() {
						findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
							let url = '/sema/site/receipts/';
							chai.request(server)
								.post(url)
								.set('Content-Type', 'application/json; charset=UTF-8')
								.send({
									"receiptId": "2",
									"customerId": "Brian",
									"siteId": kiosk.id,
									"createdDate": "9/9/18",
									"totalSales": "10",
									"cogs": "9",
									"products": [
										{
											"productId": "558",
											"quantity": "1",
											"receiptId": "2"
										},
										{
											"productId": "559",
											"quantity": "1",
											"salesPrice": "2",
											"receiptId": "2"
										}
									],
									"salesChannelId": "122"
								})
								.set('Authorization', token)
								.end(function(err, res) {
									res.should.have.status(400);
									done(err);
								});
						});
					});
				});
			});
		});
	});
});
