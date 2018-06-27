const uuidv1 = require('uuid/v1');

class Customer {
	get dueAmount() {
		return this._dueAmount;
	}

	set dueAmount(value) {
		this._dueAmount = value;
	}


	constructor(contactName, customerType, siteId) {
		this._customerId = uuidv1();
		this._address = null;
		this._contactName = contactName;
		this._customerType = customerType;
		this._gpsCoordinates = null;
		this._siteId = siteId;
		this._Name = null;
		this._phoneNumber = null;
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		this._createdDate = date;
		this._updatedDate = date;
		this._gender = null;
		this._dueAmount = 0;
	}

	databaseToClass(res) {
		if (res.hasOwnProperty("id"))
			this._customerId = res["id"];

		if (res.hasOwnProperty("address"))
			this._address = res["address"];

		if (res.hasOwnProperty("gps_coordinates"))
			this._gpsCoordinates = res["gps_coordinates"];

		if (res.hasOwnProperty("name"))
			this._Name = res["name"];

		if (res.hasOwnProperty("phone_number"))
			this._phoneNumber = res["phone_number"];

		if (res.hasOwnProperty("created_date"))
			this._createdDate = new Date(res["created_date"]);

		if (res.hasOwnProperty("updated_date"))
			this._updatedDate = new Date(res["updated_date"]);

		if (res.hasOwnProperty("gender"))
			this._gender = res["gender"];

		if (res.hasOwnProperty("due_amount"))
			this._dueAmount = res["due_amount"];
	}

	requestToClass(req) {
		if (req.body.hasOwnProperty("customerId"))
			this._customerId = req.body["customerId"];

		if (req.body.hasOwnProperty("address"))
			this._address = req.body["address"];

		if (req.body.hasOwnProperty("gpsCoordinates"))
			this._gpsCoordinates = req.body["gpsCoordinates"];

		if (req.body.hasOwnProperty("Name"))
			this._Name = req.body["Name"];

		if (req.body.hasOwnProperty("phoneNumber"))
			this._phoneNumber = req.body["phoneNumber"];

		if (req.body.hasOwnProperty("createdDate"))
			this._createdDate = new Date(req.body["createdDate"]);

		if (req.body.hasOwnProperty("updatedDate"))
			this._updatedDate = new Date(req.body["updatedDate"]);

		if (req.body.hasOwnProperty("gender"))
			this._gender = req.body["gender"];

		if (req.body.hasOwnProperty("dueAmount"))
			this._dueAmount = req.body["dueAmount"];
	}

	classToPlain() {
		return {customerId: this._customerId,
				address: this._address,
				contactName: this._contactName,
				customerType: this._customerType,
				gpsCoordinates: this._gpsCoordinates,
				siteId: this._siteId,
				Name: this._Name,
				phoneNumber: this._phoneNumber,
				createdDate: this._createdDate,
				updatedDate: this._updatedDate,
				gender: this.gender,
				dueAmount: this._dueAmount,
				}
	}


	get customerId() {
		return this._customerId;
	}

	set customerId(value) {
		this._customerId = value;
	}

	get address() {
		return this._address;
	}

	set address(value) {
		this._address = value;
	}

	get contactName() {
		return this._contactName;
	}

	set contactName(value) {
		this._contactName = value;
	}

	get customerType() {
		return this._customerType;
	}

	set customerType(value) {
		this._customerType = value;
	}

	get gpsCoordinates() {
		return this._gpsCoordinates;
	}

	set gpsCoordinates(value) {
		this._gpsCoordinates = value;
	}

	get siteId() {
		return this._siteId;
	}

	set siteId(value) {
		this._siteId = value;
	}

	get Name() {
		return this._Name;
	}

	set Name(value) {
		this._Name = value;
	}

	get phoneNumber() {
		return this._phoneNumber;
	}

	set phoneNumber(value) {
		this._phoneNumber = value;
	}

	get createdDate() {
		return this._createdDate;
	}

	set createdDate(value) {
		this._createdDate = value;
	}

	get updatedDate() {
		return this._updatedDate;
	}

	set updatedDate(value) {
		this._updatedDate = value;
	}

	get gender() {
		return this._gender;
	}

	set gender(value) {
		this._gender = value;
	}
}

module.exports = Customer;
