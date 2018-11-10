import { handleActions, combineActions } from 'redux-actions';
import {
  getProductRequest,
  getProductSuccess,
  getProductFailure
} from '../actions/ProductActions';

const initialState = {};
const selectedProductReducer = handleActions(
  {
    [combineActions(getProductRequest, getProductFailure)]: state => state,
    [getProductSuccess]: (state, { payload: { product } }) => product
  },
  initialState
);

export default selectedProductReducer;
