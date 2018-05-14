const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const sprintf = require('sprintf-js').sprintf;

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
		it('Should succed with empty sales info becuase the kioskID does not exist', function testLoginNoAuth(done) {
			chai.request(server)
				.get('/untapped/sales?kioskID=9999&groupby=month')
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.gallonsPerCustomer.should.have.property('value').eql('N/A');
					res.body.netIncome.should.have.property('total').eql('N/A');
					res.body.netIncome.period1.should.have.property('periodValue').eql('N/A');
					res.body.netIncome.period2.should.have.property('periodValue').eql('N/A');
					expect(res.body.retailSales).to.be.an('array');
					expect(res.body.retailSales).to.be.empty;
					res.body.totalRevenue.period1.should.have.property('periodValue').eql('N/A');
					res.body.should.have.property('totalCustomers').eql(0);
					done(err);
				});
		});
	});

	// There should be one sale of 4 gallons (15.141 liters) worth 15 dollars
	// There are five total customers for this Kiosk.
	// The latest two months show 1 customer created in each month
	describe('GET /untapped/Sales - UnitTest KioskID', function() {
		it('Should get info for one customer with one sale', function testLoginNoAuth(done) {
			chai.request(server)
				.get('/untapped/kiosks')
				.end(function(err, res) {
					expect(res.body.kiosks).to.be.an('array');
					res.body.kiosks[0].should.have.property('name').eql('UnitTest');
					let url = "/untapped/sales?kioskID=%d&groupby=month";
					url = sprintf( url, res.body.kiosks[0].id)
					chai.request(server)
						.get(url)
						.end(function (err, res) {
							res.should.have.status(200);
							res.body.gallonsPerCustomer.should.have.property('value').eql(14/6);	// Assumes 14 gallons in latest month, 6 total customers
							res.body.netIncome.should.have.property('total').eql('N/A');
							res.body.netIncome.period1.should.have.property('periodValue').eql('N/A');
							res.body.netIncome.period2.should.have.property('periodValue').eql('N/A');
							expect(res.body.retailSales).to.be.an('array');
							expect(res.body.retailSales).to.be.empty;
							res.body.newCustomers.period1.should.have.property('periodValue').eql(1);
							res.body.newCustomers.period2.should.have.property('periodValue').eql(2);
							res.body.should.have.property('totalCustomers').eql(6);
							let testDate = new Date(res.body.newCustomers.period1.beginDate);
							expect( testDate.getFullYear()).to.deep.equal(2018);
							expect( testDate.getMonth()+1).to.deep.equal(5);

							testDate = new Date(res.body.newCustomers.period2.beginDate);
							expect( testDate.getFullYear()).to.deep.equal(2018);
							expect( testDate.getMonth()+1).to.deep.equal(4);

							res.body.totalRevenue.should.have.property('total').eql(35);
							testDate = new Date(res.body.totalRevenue.period1.beginDate);
							expect( testDate.getFullYear()).to.deep.equal(2018);
							expect( testDate.getMonth()+1).to.deep.equal(1);
							res.body.totalRevenue.period1.should.have.property('periodValue').eql(35);

							res.body.totalRevenue.period2.should.have.property('beginDate').eql("N/A");
							done(err);
						});
				});
		});
	});

});

