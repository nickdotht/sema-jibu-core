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

}

module.exports = Product;
