const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const sprintf = require('sprintf-js').sprintf;

const findCustomerId = (server, token, contactName, siteId) => {
	return new Promise((resolve, reject) => {
		let url = sprintf('/sema/site/customers?site-id=%s', siteId);
		chai.request(server)
			.get(url)
			.set('Authorization', token)
			.end(function(err, res) {
				let customer_index = findCustomerIndex(res.body.customers, contactName);
				resolve(res.body.customers[customer_index]);
			});
	});
};

function findCustomerIndex(customers, contactName) {
	for (let i=0; i<customers.length; i++) {
		if (customers[i].contactName === contactName) {
			return i;
		}
	}
	// Invalid Index
	return -1;
}


module.exports = {findCustomerId, findCustomerIndex};
