
import {combineReducers} from 'redux';
import healthCheck from './HealthcheckReducer';
import logIn from './LoginReducer';
import kiosk from './KioskReducer';

const rootReducer = combineReducers({
    healthCheck,
	logIn,
	kiosk
});

export default rootReducer;
