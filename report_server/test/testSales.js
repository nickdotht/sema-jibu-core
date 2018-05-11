const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

process.env.NODE_ENV = 'test';  // Set environment to test

describe('Testing Sales API', function () {
	let server;
	beforeEach(function () {
		server = require('../bin/www' );
	});
	afterEach(function (done) {
		delete require.cache[require.resolve('../bin/www')];
		done();
	});
	describe('GET /untapped/Sales - missing kioskID', function() {
		it('Should fail with 400 error code', function testLoginNoAuth(done) {
			chai.request(server)
				.get('/untapped/sales')
				.end(function(err, res) {
					res.should.have.status(400);
					done(err);
				});
		});
	});
	describe('GET /untapped/Sales - unknown kioskID', function() {
		it('Should succed with empty sales info', function testLoginNoAuth(done) {
			chai.request(server)
				.get('/untapped/sales?kioskID=9999&groupby=month')
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.litersPerCustomer.should.have.property('value').eql('N/A');
					res.body.netIncome.should.have.property('total').eql('N/A');
					res.body.netIncome.should.have.property('thisPeriod').eql('N/A');
					res.body.netIncome.should.have.property('lastPeriod').eql('N/A');
					expect(res.body.retailSales).to.be.an('array');
					expect(res.body.retailSales).to.be.empty;
					res.body.totalRevenue.should.have.property('total').eql('N/A');
					res.body.should.have.property('totalCustomers').eql(0);
					done(err);
				});
		});
	});

	// There should be one sale of 4 gallons (15.141 liters) worth 15 dollars
	// There are five total customers for this Kiosk
	describe('GET /untapped/Sales - UnitTest KioskID = 115', function() {
		it('Should get info for one customer with one sale', function testLoginNoAuth(done) {
			chai.request(server)
				.get('/untapped/sales?kioskID=115&groupby=month')
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.litersPerCustomer.should.have.property('value').eql(4);
					res.body.netIncome.should.have.property('total').eql('N/A');
					res.body.netIncome.should.have.property('thisPeriod').eql('N/A');
					res.body.netIncome.should.have.property('lastPeriod').eql('N/A');
					expect(res.body.retailSales).to.be.an('array');
					expect(res.body.retailSales).to.be.empty;
					res.body.totalRevenue.should.have.property('total').eql(15);
					res.body.should.have.property('totalCustomers').eql(5);
					done(err);
				});
		});
	});

});

