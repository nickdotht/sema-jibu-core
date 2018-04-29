
import {combineReducers} from 'redux';
import healthCheck from './HealthcheckReducer';
import logIn from './LoginReducer';
import kiosk from './KioskReducer';
import waterOperations from './WaterOperationsReducer';
import sales from './SalesReducer';

const rootReducer = combineReducers({
    healthCheck,
	logIn,
	kiosk,
	waterOperations,
	sales
});

export default rootReducer;
