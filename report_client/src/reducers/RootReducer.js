
import {combineReducers} from 'redux';
import healthCheck from './HealthcheckReducer';
import logIn from './LoginReducer';

const rootReducer = combineReducers({
    healthCheck,
	logIn
});

export default rootReducer;
