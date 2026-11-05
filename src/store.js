import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./reducers/userReducers";
import { profileReducer } from "./reducers/profileReducer";
import {
  productsReducer,
  newProductReducer,
  productReducer,
  productDetailsReducer,
  catalogReducer,
} from "./reducers/productReducers";
import {
  productReviewsReducer,
  myReviewReducer,
  newReviewReducer,
  deleteMyReviewReducer,
  adminReviewsReducer,
  reviewModerationReducer,
} from "./reducers/reviewReducers";
import { cartReducer } from "./reducers/cartReducers";
import {
  checkoutReducer,
  myOrdersReducer,
  orderDetailsReducer,
  applicationDetailsReducer,
  adminOrdersReducer,
  adminApplicationsReducer,
  updateOrderStatusReducer,
  approveApplicationReducer,
  rejectApplicationReducer,
  confirmInstallmentOrderReducer,
} from "./reducers/orderReducers";

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  
  products: productsReducer,
  newProduct: newProductReducer,
  product: productReducer,
  productDetails: productDetailsReducer,
  catalog: catalogReducer,
  
  productReviews: productReviewsReducer,
  myReview: myReviewReducer,
  newReview: newReviewReducer,
  deleteMyReview: deleteMyReviewReducer,
  adminReviews: adminReviewsReducer,
  reviewModeration: reviewModerationReducer,
  
  cart: cartReducer,
  
  checkout: checkoutReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  applicationDetails: applicationDetailsReducer,
  
  adminOrders: adminOrdersReducer,
  adminApplications: adminApplicationsReducer,
  updateOrderStatus: updateOrderStatusReducer,
  approveApplication: approveApplicationReducer,
  rejectApplication: rejectApplicationReducer,
  confirmInstallmentOrder: confirmInstallmentOrderReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
