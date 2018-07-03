const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
var authenticate = require('./Utilities/authenticate');


describe('Testing Products API', function () {
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

	describe('GET /sema/products - updated-date 2016-1-1', function() {
		it('Should return info on 2 products after 2016-1-1', (done) => {
			authenticate(server).then(function(token) {
				chai.request(server)
					.get("/sema/products?updated-date=2016-1-1")
					.set('Authorization', token)
					.end(function(err, res) {
						res.should.have.status(200);
						expect(res.body.products).to.be.an('array');
						expect(res.body.products.length).to.be.equal(2);
						expect(res.body.products[0].description).to.be.equal("Product-1");
						expect(res.body.products[0].updatedDate).to.be.equal("2018-01-01T08:00:00.000Z");
						done(err);
					});


			});
		});
	});

	describe('GET /sema/site/customers - no update-date', function() {
		it('Should return info on all 4 products after 2018-1-1', (done) => {
			authenticate(server).then(function(token) {
				chai.request(server)
					.get("/sema/products")
					.set('Authorization', token)
					.end(function(err, res) {
						res.should.have.status(200);
						expect(res.body.products).to.be.an('array');
						expect(res.body.products.length).to.be.equal(4);
						done(err);
					});
			});
		});
	});
});
