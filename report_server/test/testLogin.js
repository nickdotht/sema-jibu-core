const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

process.env.NODE_ENV = 'test';  // Set environment to test

describe('Testing Login', function () {
	let server;
	beforeEach(function () {
		server = require('../bin/www' );
	});
	afterEach(function (done) {
		delete require.cache[require.resolve('../bin/www')];
		done();
	});
	describe('GET /untapped/login - missing auth', function() {
		it('should get /untapped/login', function testLoginNoAuth(done) {
			chai.request(server)
				.get('/untapped/login')
				.end(function(err, res) {
					res.should.have.status(400);	// No Auth headers!
					done(err);
				});
		});
	});
	describe('GET /untapped/login - correct auth', function() {
		it('should get /untapped/login', function testLoginNoAuth(done) {
			chai.request(server)
				.get('/untapped/login')
				.auth('administrator', 'dloHaiti')
				.end(function(err, res) {
					res.should.have.status(200);	// No Auth headers!
					done(err);
				});
		});
	});
	describe('GET /untapped/login - incorrect auth', function() {
		it('should get /untapped/login', function testLoginNoAuth(done) {
			chai.request(server)
				.get('/untapped/login')
				.auth('administrator', 'xxxx')
				.end(function(err, res) {
					res.should.have.status(401);	// No Auth headers!
					done(err);
				});
		});
	});

});

