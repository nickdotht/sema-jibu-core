require('datejs');

function PeriodData () {
	this.beginDate = "N/A";
	this.endDate = "N/A;";
	this.periodValue = "N/A";
	this.setValue = periodValue =>{ this.periodValue = periodValue} ;
	this.setDates = (beginDate, endDate ) => {
		this.endDate = endDate;
		this.beginDate = beginDate;
	};
}
function init3Periods(){
	return [ new PeriodData(), new PeriodData(), new PeriodData() ];
}

function CalcBeginDate( endDate, period, periodCount ){
	let beginDate = endDate;

	switch( period ) {
		case 'month':
		default:
			let beginDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
			beginDate.addMonths(periodCount);
			return beginDate;
	}
	return beginDate;
}

function UpdatePeriodDates( periods, endDateIn, period ){
	let endDate = new Date(endDateIn);
	let beginDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
	switch( period ) {
		case 'month':
		default:
			for( let i = 0; i < periods.length; i++ ){
				periods[i].setDates(beginDate, endDate);
				if( i == 0 ){
					endDate =  new Date( endDate.getFullYear(), endDate.getMonth(), endDate.getDaysInMonth( endDate.getFullYear(), endDate.getMonth()) );
				}
				beginDate = new Date(beginDate);
				endDate = new Date(endDate);
				beginDate.addMonths(-1);
				endDate.addMonths(-1);
			}
	}
}

module.exports = { PeriodData, init3Periods, CalcBeginDate, UpdatePeriodDates };
