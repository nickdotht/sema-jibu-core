export const NETWORK_CONNECTION = 'NETWORK_CONNECTION';


export function NetworkConnection( isNWConnected){
	console.log("NetworkConnection - action");
	return (dispatch) => { dispatch({type: NETWORK_CONNECTION, data:isNWConnected});};
}
