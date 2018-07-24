const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const sprintf = require('sprintf-js').sprintf;
var findKioskId = require('./Utilities/findKioskId');
var authenticate = require('./Utilities/authenticate');
var findCustomerId = require('./Utilities/findCustomerId');

describe.skip('Testing Customers API', function () {
	let server;
	this.timeout(6000);
	beforeEach( (done) => {
		var iAmDone = done;
		server = require('../bin/www' );
		setTimeout( function(){iAmDone()}, 1500);
	});
	afterEach( (done) => {
		var iAmDone = done;
		server.close();
		setTimeout( function(){iAmDone()}, 2000);
	});


	describe('DELETE /sema/site/customers - should delete', function() {
		it('Should fail with 400 error code', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = '/sema/site/customers/';
					chai.request(server)
						.post(url)
						.set('Content-Type', 'application/json; charset=UTF-8')
						.send({ 'customerType': '1', 'contactName': 'X', 'siteId': kiosk.id, 'customerId': '999999' })
						.set('Authorization', token)
						.end(function(err, res) {
							let url = sprintf('/sema/site/customers/%s', '999999');
							res.should.have.status(200);
							chai.request(server)
								.delete(url)
								.set('Authorization', token)
								.end(function(err, res) {
									res.should.have.status(200);
									done(err);
								});
						});
				});
			});
		});
	});

	describe('PUT /sema/site/customers - customerId', function() {
		it('Should succeed', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					findCustomerId.findCustomerId(server, token, 'TestCustomer 1', kiosk.id).then(function(customer) {
						customer.should.have.property('contactName').eql('TestCustomer 1');
						let url = sprintf('/sema/site/customers/%s', customer.customerId);
						chai.request(server)
							.put(url)
							.set('Content-Type', 'application/json; charset=UTF-8')
							.send({ 'Name': 'test name', 'gender': 'test gender' })
							.set('Authorization', token)
							.end(function(err, res) {
								findCustomerId.findCustomerId(server, token, 'TestCustomer 1', kiosk.id).then(function(customer) {
									customer.should.have.property("Name").eql("test name");
									customer.should.have.property("gender").eql("test gender");
									done(err);
								});
							});
					});
				});
			});
		});
	});

	describe('PUT /sema/site/customers - missing customerId', function() {
		it('Should fail with 400 error code', (done) => {
			authenticate(server).then(function(token) {
				chai.request(server)
					.put('/sema/site/customers/99999')
					.set('Authorization', token)
					.end(function(err, res) {
						res.should.have.status(404);
						done(err);
					});
			});
		});
	});

	describe('DELETE /sema/site/customers - missing customerId', function() {
		it('Should fail with 400 error code', (done) => {
			authenticate(server).then(function(token) {
				chai.request(server)
					.delete('/sema/site/customers/99999')
					.set('Authorization', token)
					.end(function(err, res) {
						res.should.have.status(404);
						done(err);
					});
			});
		});
	});

	describe('POST /sema/site/customers - missing siteId, customerName, customerType', function() {
		it('Should fail with 400 error code', (done) => {
			authenticate(server).then(function(token) {
				chai.request(server)
					.post('/sema/site/customers')
					.set('Authorization', token)
					.end(function(err, res) {
						res.should.have.status(400);
						done(err);
					});
			});
		});
	});

	describe('POST /sema/site/customer - unknown site-id', function() {
		it('Should fail with foreign key constraint error 500', (done) => {
			authenticate(server).then(function(token) {
				chai.request(server)
					.post('/sema/site/customers?contactName=Brian&customerType=128&siteId=9999')
					.set('Authorization', token)
					.end(function(err, res) {
						res.should.have.status(500);
						done(err);
					});
			});
		});
	});

	describe('GET /sema/site/customers - missing site-id', function() {
		it('Should fail with 400 error code', (done) => {
			authenticate(server).then(function(token) {
				chai.request(server)
					.get('/sema/site/customers')
					.set('Authorization', token)
					.end(function(err, res) {
						res.should.have.status(400);
						done(err);
					});
			});
		});
	});

	describe('GET /sema/site/customer - unknown site-id', function() {
		it('Should succeed with customer info becuase the site-id does not exist', (done) => {
			authenticate(server).then(function(token) {
				chai.request(server)
					.get('/sema/site/customers?site-id=9999')
					.set('Authorization', token)
					.end(function(err, res) {
						res.should.have.status(200);
						expect(res.body.customers).to.be.an('array');
						expect(res.body.customers).to.be.empty;
						done(err);
					});
			});
		});
	});

	describe('GET /sema/site/customers - UnitTestCustomer site-id', function() {
		it('Should get info for one customer with one sale', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = sprintf("/sema/site/customers?site-id=%d", kiosk.id);
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(6);
							done(err);
						});
				});
			});
		});
	});

	describe('GET /sema/site/customers - Begin Date 2018-2-1', function() {
		it('Should return 5 customers beginning in 2018-2-1', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = "/sema/site/customers?site-id=%d&begin-date=%s";
					kiosk.should.have.property('name').eql('UnitTestCustomers');
					url = sprintf(url, kiosk.id, new Date("2018-2-1"));
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(5);
							done(err);
						});
				});
			});
		});
	});

	describe('GET /sema/site/customers - Begin Date 2018-6-1', function() {
		it('Should return info on 0 customers beginning in 2018-6-1', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = "/sema/site/customers?site-id=%d&begin-date=%s";
					kiosk.should.have.property('name').eql('UnitTestCustomers');
					url = sprintf(url, kiosk.id, new Date("2018-6-1"));
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(0);

							done(err);
						});
				});
			});
		});
	});


	describe('GET /sema/site/customers - End Date 2018-2-1', function() {
		it('Should return 2 customers ending in 2018-2-1', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = "/sema/site/customers?site-id=%d&end-date=%s";
					kiosk.should.have.property('name').eql('UnitTestCustomers');
					url = sprintf(url, kiosk.id, new Date("2018-2-1"));
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(2);

							done(err);
						});
				});
			});
		});
	});

	describe('GET /sema/site/customers - Ending Date in 2017-1-1', function() {
		it('Should return info on 0 customers beginning in 2018-1-1', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = "/sema/site/customers?site-id=%d&end-date=%s";
					kiosk.should.have.property('name').eql('UnitTestCustomers');
					url = sprintf(url, kiosk.id, new Date("2017-1-1"));
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(0);

							done(err);
						});
				});
			});
		});
	});

	describe('GET /sema/site/customers - Updated Date 2018-3-1', function() {
		it('Should return 2 customers ending in 2018-3-1', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = "/sema/site/customers?site-id=%d&updated-date=%s";
					kiosk.should.have.property('name').eql('UnitTestCustomers');
					url = sprintf(url, kiosk.id, new Date("2018-3-1"));
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(4);
							res.body.customers[1].should.have.property("customerId");
							res.body.customers[1].should.have.property("contactName").eql("TestCustomer 4");
							res.body.customers[1].should.have.property("dueAmount").eql(0);
							res.body.customers[1].should.have.property("updatedDate").eql("2018-04-01T07:00:00.000Z");
							done(err);
						});
				});
			});
		});
	});

	describe('GET /sema/site/customers - Updated Date in 2018-5-1', function() {
		it('Should return info on 0 customers beginning in 2018-5-1', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = "/sema/site/customers?site-id=%d&updated-date=%s";
					kiosk.should.have.property('name').eql('UnitTestCustomers');
					url = sprintf(url, kiosk.id, new Date("2018-5-1"));
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(1);

							done(err);
						});
				});
			});
		});
	});

	describe('GET /sema/site/customers - Begin/End Date: 2018-2-1 / 2018-4-1', function() {
		it('Should return 4 customers between 2018-2-1 & 2018-4-1', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = "/sema/site/customers?site-id=%d&begin-date=%s&end-date=%s";
					kiosk.should.have.property('name').eql('UnitTestCustomers');
					url = sprintf(url, kiosk.id, new Date("2018-2-1"), new Date("2018-4-1"));
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(4);

							done(err);
						});
				});
			});
		});
	});

	describe('GET /sema/site/customers - Begin / End date in 2018-6-1', function() {
		it('Should return info on 0 customers beginning in 2018-8-1', (done) => {
			authenticate(server).then(function(token) {
				findKioskId.findKioskId(server, token, 'UnitTestCustomers').then(function(kiosk) {
					let url = "/sema/site/customers?site-id=%d&begin-date=%s&end-date=%s";
					kiosk.should.have.property('name').eql('UnitTestCustomers');
					url = sprintf(url, kiosk.id, new Date("2018-6-1"), new Date("2018-8-1"));
					chai.request(server)
						.get(url)
						.set('Authorization', token)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(0);
							done(err);
						});
				});
			});
		});
	});
});
