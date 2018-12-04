import { handleActions, combineActions } from 'redux-actions';
import {
  getProductRequest,
  getProductSuccess,
  getProductFailure,
  resetProduct
} from '../actions/ProductActions';

const initialState = {};
const selectedProductReducer = handleActions(
  {
    [combineActions(getProductRequest, getProductFailure)]: state => state,
    [getProductSuccess]: (state, { payload: { product } }) => product,
    [resetProduct]: state => {
      console.log('reset', state);
      return initialState;
    }
  },
  initialState
);

export default selectedProductReducer;
