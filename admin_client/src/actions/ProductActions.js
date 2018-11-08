import { axiosService } from 'services';
import { createActions } from 'redux-actions';

// Actions
export const {
  getProductsRequest,
  getProductsSuccess,
  getProductsFailure
} = createActions(
  {
    GET_PRODUCTS_SUCCESS: payload => payload
  },
  'GET_PRODUCTS_REQUEST',
  'GET_PRODUCTS_FAILURE'
);

export const {
  getProductRequest,
  getProductSuccess,
  getProductFailure
} = createActions(
  {
    GET_PRODUCT_SUCCESS: payload => payload
  },
  'GET_PRODUCT_REQUEST',
  'GET_PRODUCT_FAILURE'
);

// Action creators
export const getProducts = () => dispatch => {
  dispatch(getProductsRequest());
  return axiosService
    .get('/sema/admin/products')
    .then(response => dispatch(getProductsSuccess(response.data)))
    .catch(err => dispatch(getProductsFailure(err)));
};

export const getProduct = id => dispatch => {
  dispatch(getProductRequest());
  return axiosService
    .get(`/sema/admin/products/${id}`)
    .then(response => dispatch(getProductSuccess(response.data)))
    .catch(err => dispatch(getProductFailure(err)));
};
