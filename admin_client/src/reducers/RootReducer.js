import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import healthCheck from './HealthcheckReducer';
import auth from './AuthReducer';
import userReducer from './UserReducer';

const rootPersistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['auth', 'healthCheck']
};

const rootReducer = combineReducers({
  healthCheck,
  auth,
  user: userReducer,
  form: formReducer
});

export default persistReducer(rootPersistConfig, rootReducer);
