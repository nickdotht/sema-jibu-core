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
const uuidv1 = require('uuid/v1');

describe('Testing Customers API', function () {
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

	describe('POST /sema/site/receipts', function() {
		it('Should pass', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					findSalesByChannelId.findSalesChannelId(server, token, 'UnitTestSalesChannel', kiosk.id).then(function(salesChannel) {
						let url = '/sema/site/receipts/';
						chai.request(server)
							.post(url)
							.set('Content-Type', 'application/json; charset=UTF-8')
							.send({
								"receiptId": "2",
								"customerId": "Brian",
								"siteId": "1",
								"createdDate": "9/9/18",
								"totalSales": "10",
								"cogs": "9",
								"products": [
									{"productId": "17",
										"quantity": "1",
										"salesPrice": "1",
										"receiptId": "2"
									},
									{"productId": "18",
										"quantity": "1",
										"salesPrice": "2",
										"receiptId": "2"
									}
								],
								"salesChannelId": "1"
							})
							.set('Authorization', token)
							.end(function(err, res) {
								let h = 5;
								done(err);
								//removeReceipts.removeReceiptLineItems().then(function() {
								//	removeReceipts.removeReceipts().then(function() {
								//		done(err);
								//	});
								//});
							});
					});
				});
			});
		});
	});
});
