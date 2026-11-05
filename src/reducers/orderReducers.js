import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  CREATE_ORDER_RESET,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  MY_ORDERS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  APPLICATION_DETAILS_REQUEST,
  APPLICATION_DETAILS_SUCCESS,
  APPLICATION_DETAILS_FAIL,
  ADMIN_ORDERS_REQUEST,
  ADMIN_ORDERS_SUCCESS,
  ADMIN_ORDERS_FAIL,
  ADMIN_APPLICATIONS_REQUEST,
  ADMIN_APPLICATIONS_SUCCESS,
  ADMIN_APPLICATIONS_FAIL,
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAIL,
  UPDATE_ORDER_STATUS_RESET,
  APPROVE_APPLICATION_REQUEST,
  APPROVE_APPLICATION_SUCCESS,
  APPROVE_APPLICATION_FAIL,
  APPROVE_APPLICATION_RESET,
  REJECT_APPLICATION_REQUEST,
  REJECT_APPLICATION_SUCCESS,
  REJECT_APPLICATION_FAIL,
  REJECT_APPLICATION_RESET,
  CONFIRM_INSTALLMENT_ORDER_REQUEST,
  CONFIRM_INSTALLMENT_ORDER_SUCCESS,
  CONFIRM_INSTALLMENT_ORDER_FAIL,
  CONFIRM_INSTALLMENT_ORDER_RESET,
  CLEAR_ERRORS,
} from '../constants/orderConstants'


export const checkoutReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
      return { loading: true }
    case CREATE_ORDER_SUCCESS:
      return { loading: false, success: true, results: action.payload }
    case CREATE_ORDER_FAIL:
      return { loading: false, error: action.payload }
    case CREATE_ORDER_RESET:
      return {}
    case CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return state
  }
}


export const myOrdersReducer = (state = { orders: [], applications: [] }, action) => {
  switch (action.type) {
    case MY_ORDERS_REQUEST:
      return { ...state, loading: true }
    case MY_ORDERS_SUCCESS:
      return {
        loading: false,
        orders: action.payload.orders,
        applications: action.payload.applications,
      }
    case MY_ORDERS_FAIL:
      return { ...state, loading: false, error: action.payload }
    case CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return state
  }
}


export const orderDetailsReducer = (state = { order: null }, action) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return { loading: true, order: null }
    case ORDER_DETAILS_SUCCESS:
      return { loading: false, order: action.payload }
    case ORDER_DETAILS_FAIL:
      return { loading: false, error: action.payload, order: null }
    case CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return state
  }
}


export const applicationDetailsReducer = (state = { application: null }, action) => {
  switch (action.type) {
    case APPLICATION_DETAILS_REQUEST:
      return { loading: true, application: null }
    case APPLICATION_DETAILS_SUCCESS:
      return { loading: false, application: action.payload }
    case APPLICATION_DETAILS_FAIL:
      return { loading: false, error: action.payload, application: null }
    case CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return state
  }
}


export const adminOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ADMIN_ORDERS_REQUEST:
      return { ...state, loading: true }
    case ADMIN_ORDERS_SUCCESS:
      return { loading: false, orders: action.payload }
    case ADMIN_ORDERS_FAIL:
      return { ...state, loading: false, error: action.payload }
    case CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return state
  }
}


export const adminApplicationsReducer = (state = { applications: [] }, action) => {
  switch (action.type) {
    case ADMIN_APPLICATIONS_REQUEST:
      return { ...state, loading: true }
    case ADMIN_APPLICATIONS_SUCCESS:
      return { loading: false, applications: action.payload }
    case ADMIN_APPLICATIONS_FAIL:
      return { ...state, loading: false, error: action.payload }
    case CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return state
  }
}


export const updateOrderStatusReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_ORDER_STATUS_REQUEST:
      return { loading: true }
    case UPDATE_ORDER_STATUS_SUCCESS:
      return { loading: false, success: true, order: action.payload }
    case UPDATE_ORDER_STATUS_FAIL:
      return { loading: false, error: action.payload }
    case UPDATE_ORDER_STATUS_RESET:
      return {}
    default:
      return state
  }
}


export const approveApplicationReducer = (state = {}, action) => {
  switch (action.type) {
    case APPROVE_APPLICATION_REQUEST:
      return { loading: true }
    case APPROVE_APPLICATION_SUCCESS:
      return { loading: false, success: true, application: action.payload }
    case APPROVE_APPLICATION_FAIL:
      return { loading: false, error: action.payload }
    case APPROVE_APPLICATION_RESET:
      return {}
    default:
      return state
  }
}


export const rejectApplicationReducer = (state = {}, action) => {
  switch (action.type) {
    case REJECT_APPLICATION_REQUEST:
      return { loading: true }
    case REJECT_APPLICATION_SUCCESS:
      return { loading: false, success: true, application: action.payload }
    case REJECT_APPLICATION_FAIL:
      return { loading: false, error: action.payload }
    case REJECT_APPLICATION_RESET:
      return {}
    default:
      return state
  }
}


export const confirmInstallmentOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case CONFIRM_INSTALLMENT_ORDER_REQUEST:
      return { loading: true }
    case CONFIRM_INSTALLMENT_ORDER_SUCCESS:
      return {
        loading: false,
        success: true,
        application: action.payload.application,
        order: action.payload.order,
      }
    case CONFIRM_INSTALLMENT_ORDER_FAIL:
      return { loading: false, error: action.payload }
    case CONFIRM_INSTALLMENT_ORDER_RESET:
      return {}
    default:
      return state
  }
}
