
import { SALES_REPORT_FROM_ORDERS, REPORT_TYPE } from "../actions/ReportActions"

let initialState = {salesData:[], reportType:"sales"};

const reportReducer = (state = initialState, action) => {
	console.log("reportReducer: " +action.type);
	let newState;
	switch (action.type) {
		case SALES_REPORT_FROM_ORDERS:
			newState = {...state};
			newState.salesData = action.data.salesData ;
			return newState;

		case REPORT_TYPE:
			newState = {...state};
			newState.reportType = action.data ;
			return newState;

		default:
			return state;
	}
};


export default reportReducer;

