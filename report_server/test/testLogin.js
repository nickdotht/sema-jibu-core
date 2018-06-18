const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

process.env.NODE_ENV = 'test';  // Set environment to test

describe('Testing Login', function () {
	let server;
	this.timeout(6000);
	beforeEach( () => {
		server = require('../bin/www' );
	});
	afterEach( (done) => {
		var iAmDone = done;
		server.close();
		setTimeout( function(){iAmDone()}, 2000);
	});
	describe('POST /untapped/login - missing auth', function() {
		it('should get /untapped/login', function testLoginNoAuth(done) {
			chai.request(server)
				.post('/untapped/login')
				.end(function(err, res) {
					res.should.have.status(400);	// No Auth headers!
					done(err);
				});
		});
	});


	describe('POST /untapped/login - correct auth', function() {
		it('should get /untapped/login', function testLoginNoAuth(done) {
			chai.request(server)
				.post('/untapped/login')
				.send({ usernameOrEmail:'administrator' , password:'dloHaiti' })
				.end(function(err, res) {
					res.should.have.status(200);	// Correct Auth!
					res.body.should.have.property('version').eql('0.0.0.7');
					res.body.should.have.property('token');
					done(err);
				});
		});
	});
	describe('POST /untapped/login - incorrect auth', function() {
		it('should get /untapped/login', function testLoginNoAuth(done) {
			chai.request(server)
				.post('/untapped/login')
				.send({ usernameOrEmail:'administrator' , password:'xxxx' })
				.end(function(err, res) {
					res.should.have.status(401);	// Invalid Auth!
					done(err);
				});
		});
	});

});

