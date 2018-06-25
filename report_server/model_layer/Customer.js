const uuidv1 = require('uuid/v1');

class Customer {
	get dueAmount() {
		return this._dueAmount;
	}

	set dueAmount(value) {
		this._dueAmount = value;
	}

	get version() {
		return this._version;
	}

	set version(value) {
		this._version = value;
	}
	constructor(req) {
		if (req.body.hasOwnProperty("customerId"))
			this._customerId = req.body["customerId"];
		else
			this._customerId = uuidv1();


		if (req.body.hasOwnProperty("address"))
			this._address = req.body["address"];
		else
			this._address = null;

		this._contactName = req.body["contactName"];

		this._customerType = req.body["customerType"];

		if (req.body.hasOwnProperty("gpsCoordinates"))
		 	this._gpsCoordinates = req.body["gpsCoordinates"];
		else
			this._gpsCoordinates = null;

		this._siteId = req.body["siteId"];

		if (req.body.hasOwnProperty("Name"))
			this._Name = req.body["Name"];
		else
			this._Name = null;

		if (req.body.hasOwnProperty("phoneNumber"))
			this._phoneNumber = req.body["phoneNumber"];
		else
			this._phoneNumber = null;

		if (req.body.hasOwnProperty("createdDate"))
			this._createdDate = new Date(req.body["createdDate"]);
		else {
			var today = new Date();
			var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
			this._createdDate = date;
		}

		if (req.body.hasOwnProperty("updatedDate"))
			this._updatedDate = new Date(req.body["updatedDate"]);
		else {
			var today = new Date();
			var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
			this._updatedDate = date;
		}

		if (req.body.hasOwnProperty("gender"))
			this._gender = req.body["gender"];
		else
			this._gender = null;

		if (req.body.hasOwnProperty("dueAmount"))
			this._dueAmount = req.body["dueAmount"];
		else
			this._dueAmount = 0;

		this._version = 1;
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
				version: this._version}
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
