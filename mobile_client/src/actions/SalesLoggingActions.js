export const SET_REMOTE_SALES = 'SET_REMOTE_SALES';

export function setRemoteSales(remoteSales) {
    console.log("SetRemoteSales - action");
    return (dispatch) => { dispatch({ type: SET_REMOTE_SALES, data: { remoteSales } }) };
}