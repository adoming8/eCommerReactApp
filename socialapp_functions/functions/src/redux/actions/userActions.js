import {SET_USER,SET_ERRORS,CLEAR_ERRORS,LOADING_UI,SET_UNAUTHENTICATED,LOADING_USER,MARK_NOTIFICATIONS_READ} from '../types';
import axios from 'axios';

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });// sending a action dispatch a type
    axios
    .post('/login', userData)
        .then(res => {
           
            setAuthorizationHeader(res.data.token);
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push('/')
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
              });
        
        })
  };

  export const signupUser = (NewUserData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI });// sending a action dispatch a type
    axios
    .post('/signup', NewUserData)
        .then(res => {
           
            setAuthorizationHeader(res.data.token);
            dispatch(getUserData());
            dispatch({ type: CLEAR_ERRORS });
            history.push('/')
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
              });
        
        })
  };


  export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('FBIdToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: SET_UNAUTHENTICATED });
  };

  

  const setAuthorizationHeader = (token) => {
    const FBIdToken = `Bearer ${token}`;
    localStorage.setItem('FBIdToken', FBIdToken);
    axios.defaults.headers.common['Authorization'] = FBIdToken;
  };
