const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';  // Set environment to test

describe('Testing Kiosks', function () {
	let server;
	beforeEach(function () {
		server = require('../bin/www' );
	});
	afterEach(function (done) {
		delete require.cache[require.resolve('../bin/www')];
		done();
	});
	describe('GET /untapped/kiosks', function() {
		it('should get /untapped/kiosks', function testHealthCheck(done) {
			chai.request(server)
				.get('/untapped/kiosks')
				.end(function(err, res) {
					// console.log(JSON.stringify(res))
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('kiosks');
					expect(res.body.kiosks).to.be.an('array');
					res.body.kiosks[0].should.have.property('name').eql('UnitTest');
					done(err);
				});
		});
	});
	describe('404 everything else', function() {
		it('404 everything else', function testPath(done) {
			request(server)
				.get('/untapped/rubbish')
				.end(function (err ) {
					done(err);
				});
		});
	});
});

