const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
var findKioskIndex = require('./Utilities/findKioskIndex');
process.env.NODE_ENV = 'test';  // Set environment to test

describe('Testing Kiosks', function () {
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
	describe('GET /untapped/kiosks', function() {
		it('should get /untapped/kiosks', function testKiosks(done) {
			chai.request(server)
				.post('/untapped/login')
				.send({ usernameOrEmail:'administrator' , password:'dloHaiti' })
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.have.property('token');
					let token = "Bearer " + res.body.token;
					chai.request(server)
						.get('/untapped/kiosks')
						.set('Authorization', token)
						.end(function(err, res) {
							// console.log(JSON.stringify(res))
							res.should.have.status(200);
							let site_index = findKioskIndex(res.body.kiosks, 'UnitTest');
							res.body.should.be.a('object');
							res.body.should.have.property('kiosks');
							expect(res.body.kiosks).to.be.an('array');
							res.body.kiosks[site_index].should.have.property('name').eql('UnitTest');
							done(err);
						});
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

