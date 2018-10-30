process.env.NODE_ENV = 'test';
let chai = require('chai');
const app = require('../bin/www');
const request = require('supertest')(app);
let should = chai.should();

describe('Users', () => {
	var token;
	beforeEach(done => {
		request
			.post('/sema/login')
			.send({ usernameOrEmail: 'unittest', password: 'testpassword' })
			.end(function(err, res) {
				if (err) throw err;
				token = res.body.token;
				done();
			});
	});
	describe('/GET user', () => {
		it('it should get all the users', done => {
			request
				.get('/sema/users')
				.set('Authorization', 'Bearer ' + token)
				.expect(200)
				.end((err, res) => {
					res.body.should.be.a('object');
					res.body.should.have.property('users');
					res.body.users.should.be.a('array');
					done();
				});
		});
	});
});
