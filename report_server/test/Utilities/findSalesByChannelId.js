const request = require('supertest');
const expect = require('chai').expect;
const chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

const findSalesByChannelId = (server, token, salesByChannelName, kioskId) => {
	return new Promise((resolve, reject) => {
		let url = "/untapped/sales-by-channel?kioskID=" + kioskId +"&groupby=month";
		chai.request(server)
			.get(url)
			.set('Authorization', token)
			.end(function(err, res) {
				let sales_by_channel_index = findSalesChannelIndex(res.body.salesByChannel, salesByChannelName);
				resolve(res.body.salesByChannel[sales_by_channel_index]);
			});
	});
};

function findSalesChannelIndex(salesByChannels, salesChannelName) {
	for (let i=0; i<salesByChannels.length; i++) {
		if (salesChannels[i].name === salesChannelName) {
			return i;
		}
	}
	// Invalid Index
	return -1;
}



module.exports = {findSalesChannelId: findSalesByChannelId};
