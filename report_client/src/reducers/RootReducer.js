
import {combineReducers} from 'redux';
import healthCheck from './HealthcheckReducer';
import auth from './AuthReducer';
import kiosk from './KioskReducer';
import waterOperations from './WaterOperationsReducer';
import sales from './SalesReducer';

const rootReducer = combineReducers({
    healthCheck,
	auth,
	kiosk,
	waterOperations,
	sales
});

export default rootReducer;
