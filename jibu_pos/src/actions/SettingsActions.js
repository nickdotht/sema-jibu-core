export const SET_SETTINGS = 'SET_SETTINGS';

export function setSettings( settings){
	console.log("setSettings - action");
	return (dispatch) => { dispatch({type: SET_SETTINGS, data:settings});};
}
