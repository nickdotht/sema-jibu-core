const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const sprintf = require('sprintf-js').sprintf;
var findKioskIndex = require('./Utilities/findKioskIndex');


describe('Testing Customers API', function () {
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

	describe('PUT /sema/site/customers - missing customerId', function() {
		it('Should fail with 400 error code', (done) => {
			chai.request(server)
				.put('/sema/site/customers/99999')
				.end(function(err, res) {
					res.should.have.status(404);
					done(err);
				});
		});
	});


	describe('DELETE /sema/site/customers - missing customerId', function() {
		it('Should fail with 400 error code', (done) => {
			chai.request(server)
				.delete('/sema/site/customers/99999')
				.end(function(err, res) {
					res.should.have.status(404);
					done(err);
				});
		});
	});

	describe('POST /sema/site/customers - missing siteId, customerName, customerType', function() {
		it('Should fail with 400 error code', (done) => {
			chai.request(server)
				.post('/sema/site/customers')
				.end(function(err, res) {
					res.should.have.status(400);
					done(err);
				});
		});
	});

	describe('POST /sema/site/customer - unknown site-id', function() {
		it('Should fail with foreign key constraint error 500', (done) => {
			chai.request(server)
				.post('/sema/site/customers?contactName=Brian&customerType=128&siteId=9999')
				.end(function(err, res) {
					res.should.have.status(500);

					done(err);
				});
		});
	});

	describe('GET /sema/site/customers - missing site-id', function() {
		it('Should fail with 400 error code', (done) => {
			chai.request(server)
				.get('/sema/site/customers')
				.end(function(err, res) {
					res.should.have.status(400);
					done(err);
				});
		});
	});



	describe('GET /sema/site/customer - unknown site-id', function() {
		it('Should succeed with customer info becuase the site-id does not exist', (done) => {
			chai.request(server)
				.post('/untapped/login')
				.send({ usernameOrEmail: 'administrator', password: 'dloHaiti' })
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.have.property('token');
					let token = "Bearer " + res.body.token;
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

			chai.request(server)
				.post('/untapped/login')
				.send({ usernameOrEmail: 'administrator', password: 'dloHaiti' })
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.have.property('token');
					let token = "Bearer " + res.body.token;

					chai.request(server)
						.get('/untapped/kiosks')
						.set('Authorization', token)
						.end(function(err, res) {
							expect(res.body.kiosks).to.be.an('array');
							let url = "/sema/site/customers?site-id=%d";
							let site_index = findKioskIndex(res.body.kiosks, 'UnitTest');
							res.body.kiosks[site_index].should.have.property('name').eql('UnitTest');
							url = sprintf(url, res.body.kiosks[site_index].id);

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
			chai.request(server)
				.get('/untapped/kiosks')
				.end(function(err, res) {
					expect(res.body.kiosks).to.be.an('array');
					let url = "/sema/site/customers?site-id=%d&begin-date=%s";
					let site_index = findKioskIndex(res.body.kiosks, 'UnitTest');

					res.body.kiosks[site_index].should.have.property('name').eql('UnitTest');

					url = sprintf(url, res.body.kiosks[site_index].id, new Date("2018-2-1"));

					chai.request(server)
						.get(url)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(5);

							done(err);
						});
				});
		});
	});


	describe('GET /sema/site/customers - Begin Date 2018-6-1', function() {
		it('Should return info on 0 customers beginning in 2018-6-1', (done) => {
			chai.request(server)
				.get('/untapped/kiosks')
				.end(function(err, res) {
					expect(res.body.kiosks).to.be.an('array');
					let url = "/sema/site/customers?site-id=%d&begin-date=%s";
					let site_index = findKioskIndex(res.body.kiosks, 'UnitTest');

					res.body.kiosks[site_index].should.have.property('name').eql('UnitTest');

					url = sprintf(url, res.body.kiosks[site_index].id, new Date("2018-6-1"));

					chai.request(server)
						.get(url)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(0);

							done(err);
						});
				});
		});
	});


	describe('GET /sema/site/customers - End Date 2018-2-1', function() {
		it('Should return 2 customers ending in 2018-2-1', (done) => {
			chai.request(server)
				.get('/untapped/kiosks')
				.end(function(err, res) {
					expect(res.body.kiosks).to.be.an('array');
					let url = "/sema/site/customers?site-id=%d&end-date=%s";
					let site_index = findKioskIndex(res.body.kiosks, 'UnitTest');

					res.body.kiosks[site_index].should.have.property('name').eql('UnitTest');

					url = sprintf(url, res.body.kiosks[site_index].id, new Date("2018-2-1"));

					chai.request(server)
						.get(url)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(2);

							done(err);
						});
				});
		});
	});
	describe('GET /sema/site/customers - Ending Date in 2017-1-1', function() {
		it('Should return info on 0 customers beginning in 2018-1-1', (done) => {
			chai.request(server)
				.get('/untapped/kiosks')
				.end(function(err, res) {
					expect(res.body.kiosks).to.be.an('array');
					let url = "/sema/site/customers?site-id=%d&end-date=%s";
					let site_index = findKioskIndex(res.body.kiosks, 'UnitTest');
					res.body.kiosks[site_index].should.have.property('name').eql('UnitTest');
					url = sprintf(url, res.body.kiosks[site_index].id, new Date("2017-1-1"));
					chai.request(server)
						.get(url)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(0);

							done(err);
						});
				});
		});
	});


	describe('GET /sema/site/customers - Updated Date 2018-3-1', function() {
		it('Should return 2 customers ending in 2018-3-1', (done) => {
			chai.request(server)
				.get('/untapped/kiosks')
				.end(function(err, res) {
					expect(res.body.kiosks).to.be.an('array');
					let url = "/sema/site/customers?site-id=%d&updated-date=%s";
					let site_index = findKioskIndex(res.body.kiosks, 'UnitTest');

					res.body.kiosks[site_index].should.have.property('name').eql('UnitTest');

					url = sprintf(url, res.body.kiosks[site_index].id, new Date("2018-3-1"));

					chai.request(server)
						.get(url)
						.end(function(err, res) {
							res.should.have.status(200);

							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(3);
							res.body.customers[0].should.have.property("customerId");
							res.body.customers[0].should.have.property("contactName").eql("TestCustomer 4");
							res.body.customers[0].should.have.property("customerType").eql(128);
							res.body.customers[0].should.have.property("dueAmount").eql(0);
							res.body.customers[0].should.have.property("updatedDate").eql("2018-04-01T07:00:00.000Z");

							done(err);
						});
				});
		});
	});

	describe('GET /sema/site/customers - Updated Date in 2018-5-1', function() {
		it('Should return info on 0 customers beginning in 2018-5-1', (done) => {
			chai.request(server)
				.get('/untapped/kiosks')
				.end(function(err, res) {
					expect(res.body.kiosks).to.be.an('array');
					let url = "/sema/site/customers?site-id=%d&updated-date=%s";
					let site_index = findKioskIndex(res.body.kiosks, 'UnitTest');
					res.body.kiosks[site_index].should.have.property('name').eql('UnitTest');

					url = sprintf(url, res.body.kiosks[site_index].id, new Date("2018-5-1"));

					chai.request(server)
						.get(url)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(0);

							done(err);
						});
				});
		});
	});



	describe('GET /sema/site/customers - Begin/End Date: 2018-2-1 / 2018-4-1', function() {
		it('Should return 4 customers between 2018-2-1 & 2018-4-1', (done) => {
			chai.request(server)
				.get('/untapped/kiosks')
				.end(function(err, res) {
					expect(res.body.kiosks).to.be.an('array');
					let url = "/sema/site/customers?site-id=%d&begin-date=%s&end-date=%s";
					let site_index = findKioskIndex(res.body.kiosks, 'UnitTest');

					res.body.kiosks[site_index].should.have.property('name').eql('UnitTest');

					url = sprintf(url, res.body.kiosks[site_index].id, new Date("2018-2-1"), new Date("2018-4-1"));

					chai.request(server)
						.get(url)
						.end(function(err, res) {
							res.should.have.status(200);
							expect(res.body.customers).to.be.an('array');
							expect(res.body.customers.length).to.be.equal(4);

							done(err);
						});
				});
		});
	});

	describe('GET /sema/site/customers - Begin / End date in 2018-6-1', function() {
		it('Should return info on 0 customers beginning in 2018-8-1', (done) => {
			chai.request(server)
				.get('/untapped/kiosks')
				.end(function(err, res) {
					expect(res.body.kiosks).to.be.an('array');
					let url = "/sema/site/customers?site-id=%d&begin-date=%s&end-date=%s";
					let site_index = findKioskIndex(res.body.kiosks, 'UnitTest');

					res.body.kiosks[site_index].should.have.property('name').eql('UnitTest');

					url = sprintf(url, res.body.kiosks[site_index].id, new Date("2018-6-1"), new Date("2018-8-1"));

					chai.request(server)
						.get(url)
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
