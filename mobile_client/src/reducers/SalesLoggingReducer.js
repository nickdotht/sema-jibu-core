
import { SET_REMOTE_SALES } from "../actions/SalesLoggingActions";

let initialState = {
    remoteSales: null
};

const salesLoggingReducer = (state = initialState, action) => {
    console.log("salesLoggingReducer: " + action.type);
    let newState;
    switch (action.type) {
        case SET_REMOTE_SALES:
            newState = { ...state };
            newState.products = newState.products.concat(action.data);
            return newState;
        default:
            return state;
    }
};

export default salesLoggingReducer;


