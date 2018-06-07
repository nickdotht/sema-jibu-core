
export const SHOW_MAIN = 'SHOW_MAIN';
export const SHOW_REPORT = 'SHOW_REPORT';


export function ShowMain( ){
	console.log("SHOW_MAIN - action");
	return (dispatch) => { dispatch({type: SHOW_MAIN, data:{}});};
}

export function ShowReport( ){
	console.log("SHOW_REPORT - action");
	return (dispatch) => { dispatch({type: SHOW_REPORT, data:{}});};
}
