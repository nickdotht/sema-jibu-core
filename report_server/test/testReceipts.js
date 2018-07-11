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
								'receiptId': uuidv1(),
								'customerId': '999',
								'siteId': kiosk.id,
								'createdDate': '1/1/2000',
								'totalSales': '1',
								'cogs': '1',
								'products': '[{},{}]',
								'salesChannelId': '1'	//salesChannel.id
							})
							.set('Authorization', token)
							.end(function(err, res) {
								done(err);
							});
					});
				});
			});
		});
	});
});
