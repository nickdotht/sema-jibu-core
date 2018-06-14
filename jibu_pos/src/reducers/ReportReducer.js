
import { SALES_REPORT_FROM_ORDERS } from "../actions/ReportActions"

let initialState = {salesData:[]};

const reportReducer = (state = initialState, action) => {
	console.log("reportReducer: " +action.type);
	let newState;
	switch (action.type) {
		case SALES_REPORT_FROM_ORDERS:
			newState = {...state};
			newState.salesData = action.data.salesData ;
			return newState;


		default:
			return state;
	}
};


export default reportReducer;

