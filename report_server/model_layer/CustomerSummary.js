class CustomerSummary {

	constructor(beginDate, endDate){
		this.beginDate = beginDate;
		this.endDate = endDate;
	}
	addCustomerCount( value ){
		this.customerCount = value;
	}
	addConsumerBase( value ){
		this.consumerBase = value;
	}

	addIncomeGT( value ){
		this.incomeGreaterThan = value;
	}
	addIncomeLT( value ){
		this.incomeLessThan = value;
	}

	addDistanceGT( value ){
		this.distanceGreaterThan = value;
	}
	addDistanceLT( value ){
		this.distanceLessThan = value;
	}

	addGender( value ){
		this.gender = value;

	}
	addData( data ){
		this.customer_counts.data.push( data );
	}

	classToPlain() {
		return this;
	}

}

module.exports = CustomerSummary;
