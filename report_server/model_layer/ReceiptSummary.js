class ReceiptSummary {

	constructor(type, beginDate, endDate){
		this.beginDate = beginDate;
		this.endDate = endDate;
		this.type = type;
		this.volume = {data:[]}
	}

	addIncomeGT( value ){
		this.incomeGreaterThan = value;
	}
	addIncomeLT( value ){
		this.incomeLessThan = value;
	}

	addCustomerType( value ){
		this.customerType = value;

	}
	addData( data ){
		this.volume.data.push( data );
	}

	classToPlain() {
		return this;
	}

}

module.exports = ReceiptSummary;
