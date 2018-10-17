class WaterChart {

	constructor(type, beginDate, endDate){
		this.beginDate = beginDate;
		this.endDate = endDate;
		this.type = type;
		this.data = {}
	}

	setData( data ){
		this.data = data;
	}

	classToPlain() {
		return this;
	}

}

module.exports = WaterChart;
