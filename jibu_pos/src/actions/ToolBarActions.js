
export const SHOW_MAIN = 'SHOW_MAIN';
export const SHOW_REPORT = 'SHOW_REPORT';
export const SET_LOGGED_IN = 'SET_LOGGED_IN';

export function ShowMain( ){
	console.log("SHOW_MAIN - action");
	return (dispatch) => { dispatch({type: SHOW_MAIN, data:{}});};
}

export function ShowReport( ){
	console.log("SHOW_REPORT - action");
	return (dispatch) => { dispatch({type: SHOW_REPORT, data:{}});};
}

export function SetLoggedIn( loggedIn){
	console.log("SET_LOGGED_IN - action");
	return (dispatch) => { dispatch({type: SET_LOGGED_IN, data:{loggedIn:loggedIn}});};
}
