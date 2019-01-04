
import { SET_REMOTE_SALES } from "../actions/SalesLoggingActions";

let initialState = {
    remoteSales: null
};

const salesLoggingReducer = (state = initialState, action) => {
    console.log("salesLoggingReducer: " + action.type);
    switch (action.type) {
        case SET_REMOTE_SALES:
            return action.data;
        default:
            return state;
    }
};

export default salesLoggingReducer;


