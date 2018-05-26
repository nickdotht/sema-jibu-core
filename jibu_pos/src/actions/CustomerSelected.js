export const CUSTOMER_SELECTED = 'CUSTOMER_SELECTED';


export function CustomerSelected( customer){
	console.log("CustomerSelected - action");
	const data = customer;
	return (dispatch) => {
		setTimeout(() => {
			dispatch({type: CUSTOMER_SELECTED, data:data});
		}, 500);

	};
	// return {type: CUSTOMER_SELECTED, data:customer};

}
