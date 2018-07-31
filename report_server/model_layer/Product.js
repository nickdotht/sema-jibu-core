class Product {

	constructor(vals) {
		this._productId = vals["id"];
		this._version = vals["version"];
		this._active = vals["active"];
		this._base64encodedImage = vals["base64encoded_image"];
		this._categoryId = vals["category_id"];
		this._description = vals["description"];
		this._gallons = vals["gallons"];
		this._maximumQuantity = vals["maximum_quantity"];
		this._minimumQuantity = vals["minimum_quantity"];
		this._priceAmount = vals["price_amount"];
		this._priceCurrency = vals["price_currency"];
		this._sku = vals["sku"];
		this._updatedDate = vals["updated_date"];
		this._vals = vals;
	}

	classToPlain() {
		return {
			productId: this._productId,
			version: this._version,
			active: this._active,
			base64encodedImage: this._base64encodedImage,
			categoryId: this._categoryId,
			description: this._description,
			gallons: this._gallons,
			maximumQuantity: this._maximumQuantity,
			minimumQuantity: this._minimumQuantity,
			priceAmount: this._priceAmount,
			priceCurrency: this._priceCurrency,
			sku: this._sku,
			updatedDate: this._updatedDate
		}
	}

	get vals() {
		return this._vals;
	}

	set vals(value) {
		this._vals = value;
	}

	get version() {
		return this._version;
	}

	set version(value) {
		this._version = value;
	}

	get active() {
		return this._active;
	}

	set active(value) {
		this._active = value;
	}

	get base64encodedImage() {
		return this._base64encodedImage;
	}

	set base64encodedImage(value) {
		this._base64encodedImage = value;
	}

	get categoryId() {
		return this._categoryId;
	}

	set categoryId(value) {
		this._categoryId = value;
	}

	get description() {
		return this._description;
	}

	set description(value) {
		this._description = value;
	}

	get gallons() {
		return this._gallons;
	}

	set gallons(value) {
		this._gallons = value;
	}

	get maximumQuantity() {
		return this._maximumQuantity;
	}

	set maximumQuantity(value) {
		this._maximumQuantity = value;
	}

	get minimumQuantity() {
		return this._minimumQuantity;
	}

	set minimumQuantity(value) {
		this._minimumQuantity = value;
	}

	get priceAmount() {
		return this._priceAmount;
	}

	set priceAmount(value) {
		this._priceAmount = value;
	}

	get priceCurrency() {
		return this._priceCurrency;
	}

	set priceCurrency(value) {
		this._priceCurrency = value;
	}

	get sku() {
		return this._sku;
	}

	set sku(value) {
		this._sku = value;
	}

	get updatedDate() {
		return this._updatedDate;
	}

	set updatedDate(value) {
		this._updatedDate = value;
	}
	get productId() {
		return this._productId;
	}

	set productId(value) {
		this._productId = value;
	}


}

module.exports = Product;
