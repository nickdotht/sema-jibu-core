class Receipt {

	constructor(jsonBody){
		this._createdAt = new Date( jsonBody["createdAt"]);
		this._updatedAt = this._createdAt;
		this._currencyCode = jsonBody["currencyCode"];
		this._customerId = jsonBody["customerId"];
		this._amountCash = jsonBody["amountCash"];
		this._amountMobile = jsonBody["amountMobile"];
		this._amountLoan = jsonBody["amountLoan"];
		this._amountCard = jsonBody["amountCard"];
		this._siteId = jsonBody["siteId"];
		this._paymentType = "";	// ????
		this._salesChannelId = jsonBody["salesChannelName"];
		this._customerType = jsonBody["customerType"];
		this._totalSales = jsonBody["totalSales"];
		this._cogs = jsonBody["cogs"];
		this._receiptId = jsonBody["receiptId"];
		this._products = jsonBody["products"];
	}


	classToPlain() {
		return {
			createdAt:this._createdAt,
			updatedAt: this._updatedAt,
			currencyCode: this._currencyCode,

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
	get createdAt() {
		return this._createdAt;
	}

	get updatedAt() {
		return this._updatedAt;
	}
	get currencyCode() {
		return this._currencyCode;
	}
	get amountCash() {
		return this._amountCash;
	}

	get amountMobile() {
		return this._amountMobile;
	}

	get amountLoan() {
		return this._amountLoan;
	}

	get amountCard() {
		return this._amountCard;
	}

	get siteId() {
		return this._siteId;
	}

	get paymentType() {
		return this._paymentType;
	}
	get salesChannelId() {
		return this._salesChannelId;
	}

	get customerType() {
		return this._customerType;
	}

	get totalSales() {
		return this._totalSales;
	}
	get cogs() {
		return this._cogs;
	}


	get receiptId() {
		return this._receiptId;
	}



	get products() {
		return this._products;
	}


	get customerId() {
		return this._customerId;
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
