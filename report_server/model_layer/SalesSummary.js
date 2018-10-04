const { PeriodData } = require(`${__basedir}/seama_services/datetime_services`);

class SalesSummary {

	constructor(beginDate, endDate){
		this.beginDate = beginDate;
		this.endDate = endDate;
		this.totalRevenue =   {total: null, period: null, periods: PeriodData.init3Periods()},
		this.totalCustomers = {total: null, period: null, periods: PeriodData.init3Periods()}
	}

	setTotalRevenue( value ){
		this.totalRevenue.total = value;
	}
	setTotalRevenuePeriod( value ){
		this.totalRevenue.period = value;
	}
	getTotalRevenuePeriods(){
		return this.totalRevenue.periods;
	}

	setTotalCustomers( value ){
		this.totalCustomers.total = value;
	}
	setTotalCustomersPeriod( value ){
		this.totalCustomers.period = value;
	}
	getTotalCustomersPeriods(){
		return this.totalCustomers.periods;
	}

	setNewCustomers( period, periods ){
		this.newCustomers.period = period;
		this.newCustomers.periods = periods;
	}

	addCustomerType( value ){
		this.customerType = value;

	}
	addPaymentType( value ){
		this.paymentType = value;

	}

	addData( data ){
		this.volume.data.push( data );
	}

	classToPlain() {
		return this;
	}

}

module.exports = SalesSummary;
