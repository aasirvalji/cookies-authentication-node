import axios from "axios";
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  AUTH_ERROR,
  USER_LOADED,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT
} from "./types";

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/v1/auth/status", {withCredentials: true});
    // console.log(res)
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//Register User
export const register = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/v1/auth/register", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data, //route sends back token
    });
    dispatch(loadUser());
  } catch (err) {
    console.log(err)

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

//Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/v1/auth/login", body, config);
    // console.log(res)
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data, //route sends back token
    });
    dispatch(loadUser());
  } catch (err) {
    console.log(err)

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

//Logout user and clear profile
export const logout = () => async (dispatch) => {
    
    try {
        const res = await axios.post("/api/v1/auth/logout");
    
        dispatch({
          type: LOGOUT,
          payload: res.data, //route sends back token
        });
        dispatch(loadUser());
      } catch (err) {
        console.log(err)
    
      }
};
