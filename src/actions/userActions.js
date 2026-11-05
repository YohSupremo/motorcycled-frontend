import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  CLEAR_ERRORS,
} from "../constants/userConstants";

const api = import.meta.env.VITE_API;



const SESSION_MARKER = "isLoggedIn";
const markLoggedIn = () => {
  try {
    localStorage.setItem(SESSION_MARKER, "1");
  } catch {
    
  }
};
const clearSessionMarker = () => {
  try {
    localStorage.removeItem(SESSION_MARKER);
  } catch {
    
  }
};



const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

export const isDeactivationError = (error) =>
  error?.response?.status === 403 &&
  error?.response?.data?.message
    ?.toLowerCase()
    .includes("account has been deactivated");

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      skipDeactivationRedirect: true,
    };

    const { data } = await axios.post(
      `${api}/login`,
      { email, password },
      config,
    );

    console.log(data);
    markLoggedIn();

    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        ...data.user,
        address: data.address,
      },
    });
    return { success: true };
  } catch (error) {
    clearSessionMarker();
    if (error?.response?.data?.canReactivate) {
      dispatch({
        type: LOGIN_FAIL,
        payload: null,
      });
      return { canReactivate: true, message: error.response.data.message };
    }
    dispatch({
      type: LOGIN_FAIL,
      payload: getErrorMessage(error),
    });
    return { success: false, message: getErrorMessage(error) };
  }
};

export const reactivateOwnAccount = (email, password) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `${api}/reactivate`,
      { email, password },
      { withCredentials: true },
    );
    markLoggedIn();
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { ...data.user, address: data.address },
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
};


export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });

    const { data } = await axios.get(`${api}/me`, { withCredentials: true });

    markLoggedIn();

    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: {
        ...data.user,
        address: data.address,
      },
    });
  } catch (error) {
    clearSessionMarker();
    if (isDeactivationError(error)) return;
    dispatch({
      type: LOAD_USER_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    await axios.get(`${api}/logout`, config);

    clearSessionMarker();

    dispatch({
      type: LOGOUT_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: LOGOUT_FAIL,
      payload: getErrorMessage(error),
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};


export const firebaseLoginAction = (socialUserData) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `${api}/firebase-login`,
      socialUserData,
      config,
    );

    if (data.isRegistered === false) {
      clearSessionMarker();
      
      
      dispatch({ type: LOGIN_FAIL, payload: null });
      return {
        success: false,
        notRegistered: true,
        email: socialUserData.email,
        message: data.message,
      };
    }

    markLoggedIn();

    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        ...data.user,
        address: data.address,
      },
    });

    return { success: true };
  } catch (error) {
    clearSessionMarker();
    const message = getErrorMessage(error);
    dispatch({
      type: LOGIN_FAIL,
      payload: message,
    });
    return { success: false, message };
  }
};
