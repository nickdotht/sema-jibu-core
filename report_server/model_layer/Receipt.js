class Receipt {

	constructor(jsonBody){
		this._receiptId = jsonBody["receiptId"];
		this._customerId = jsonBody["customerId"];
		this._siteId = jsonBody["siteId"];
		this._createdDate = jsonBody["createdDate"];
		this._totalSales = jsonBody["totalSales"];
		this._cogs = jsonBody["receiptId"];
		this._products = jsonBody["products"];
		this._salesChannelId = jsonBody["salesChannelId"];
	}


	classToPlain() {
		return {
			receiptId: this._receiptId,
			customerId: this._customerId,
			siteId: this._siteId,
			createdDate: this._createdDate,
			totalSales: this._totalSales,
			receiptId: this._cogs,
			products: this._products,
			salesChannelId: this._salesChannelId
		}
	}

	get receiptId() {
		return this._receiptId;
	}

	set receiptId(value) {
		this._receiptId = value;
	}

	get products() {
		return this._products;
	}

	set products(value) {
		this._products = value;
	}

	get customerId() {
		return this._customerId;
	}

	set customerId(value) {
		this._customerId = value;
	}

	get siteId() {
		return this._siteId;
	}

	set siteId(value) {
		this._siteId = value;
	}

	get createdDate() {
		return this._createdDate;
	}

	set createdDate(value) {
		this._createdDate = value;
	}

	get totalSales() {
		return this._totalSales;
	}

	set totalSales(value) {
		this._totalSales = value;
	}

	get cogs() {
		return this._cogs;
	}

	set cogs(value) {
		this._cogs = value;
	}

	get salesChannelId() {
		return this._salesChannelId;
	}

	set salesChannelId(value) {
		this._salesChannelId = value;
	}

}

/* NOT SURE IF NECESSARY
class ReceiptProduct {
	constructor(productId, quantity, salesPrice, receiptId) {
		this._productId = productId;
		this._quantity = quantity;
		this._salesPrice = salesPrice;
		this._receiptId = receiptId;
	}
}
*/

module.exports = Receipt;
