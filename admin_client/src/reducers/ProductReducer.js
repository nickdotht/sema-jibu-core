import { handleActions, combineActions } from 'redux-actions';
import { updateObjectInArray } from './helpers';
import {
  getProductsRequest,
  getProductsSuccess,
  getProductsFailure,
  createProductRequest,
  createProductSuccess,
  createProductFailure
} from '../actions/ProductActions';

// State
const initialState = [];
const productReducer = handleActions(
  {
    [combineActions(
      getProductsRequest,
      getProductsFailure,
      createProductRequest
    )]: state => state,
    [getProductsSuccess]: (state, { payload: { products } }) => products,
    [createProductSuccess]: (state, { payload: { data: product } }) => {
      console.log('createproductsuccess', state.products, product);
      return updateObjectInArray(state.products, product);
    },
    [createProductFailure]: (state, { payload: error }) => error
  },
  initialState
);

export default productReducer;
