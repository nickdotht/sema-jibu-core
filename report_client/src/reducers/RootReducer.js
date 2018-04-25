
import {combineReducers} from 'redux';
import healthCheck from './HealthcheckReducer';
import logIn from './LoginReducer';
import kiosk from './KioskReducer';
import waterOperations from './WaterOperationsReducer';

const rootReducer = combineReducers({
    healthCheck,
	logIn,
	kiosk,
	waterOperations
});

export default rootReducer;
