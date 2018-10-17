class WaterSummary {

	constructor(beginDate, endDate){
		this.beginDate = beginDate;
		this.endDate = endDate;
		this.totalProduction = null;
		this.fillStation = null;
		this.pressurePreMembrane = null;
		this.pressurePostMembrane = null;
		this.distributionFlowRate = null;
		this.productFlowRate = null;
		this.sourceFlowRate = null;
	}

	setTotalProduction( value ){
		this.totalProduction = value;
	}
	setFillStation( value ){
		this.fillStation = value;
	}

	setPressurePreMembrane( value ){
		this.pressurePreMembrane = value;
	}
	setPressurePostMembrane( value ){
		this.pressurePostMembrane = value;
	}
	setDistributionFlowRate( value ){
		this.distributionFlowRate = value;
	}
	setProductFlowRate( value ){
		this.productFlowRate = value;
	}
	setSourceFlowRate( value ){
		this.sourceFlowRate = value;
	}

	classToPlain() {
		return this;
	}

}

module.exports = WaterSummary;
