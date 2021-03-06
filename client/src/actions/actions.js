import { GET_USERS, ADD_USER, HANDLE_CHANGE_EMAIL, HANDLE_CHANGE_USERNAME, HANDLE_CHANGE_PASSWORD, 
         TOGGLE_SIGNEDUP, SET_USERNAMETAKEN_TRUE, SET_USERNAMETAKEN_FALSE,
         SET_INVALID, SET_INVALID_SIGNUP, TOGGLE_SIGNUP_OR_LOGIN,
         GET_CRYPTOS, ROW_CLICKED, HANDLE_CRYPTOCURRENCY_VALUE, UPDATE_USER,
         TOGGLE_INVALID_VALUE } from '../constants'

import * as service from '../services'

const actions = {

    getUsers: () => ({
        type: GET_USERS,
        payload: service.getUsers()
    }),
    addUser: (user) => ({
        type: ADD_USER,
        payload: service.addUser(user)
    }),
    toggleSignupOrLogin: (bool) => ({
        type: TOGGLE_SIGNUP_OR_LOGIN,
        payload: bool
    }),
    handleChangeEmail: (email) => ({
        type: HANDLE_CHANGE_EMAIL,
        payload: email
    }),
    handleChangeUsername: (username) => ({
        type: HANDLE_CHANGE_USERNAME,
        payload: username
    }),
    handleChangePassword: (password) => ({
        type: HANDLE_CHANGE_PASSWORD,
        payload: password
    }),    
    toggleSignedup: (bool) => ({
        type: TOGGLE_SIGNEDUP,
        payload: bool
    }),
    setUsernameTakenTrue: () => ({
        type: SET_USERNAMETAKEN_TRUE
    }),
    setUsernameTakenFalse: () => ({
        type: SET_USERNAMETAKEN_FALSE
    }),
    setInvalid: () => ({
        type: SET_INVALID
    }),
    setInvalidSignup: () => ({
        type: SET_INVALID_SIGNUP
    }),
    getCryptos: (start, limit) => ({
        type: GET_CRYPTOS,
        payload: service.getCryptos(start, limit)
    }),
    handleRowClick: (cryptocurrency) => ({
        type: ROW_CLICKED,
        payload: cryptocurrency
    }),
    handleCryptocurrencyValue: (value) => ({
        type: HANDLE_CRYPTOCURRENCY_VALUE,
        payload: value
    }),
    updateUser: (userModel) => ({
        type: UPDATE_USER,
        payload: service.updateUser(userModel)
    }),
    toggleInvalidValue: (bool) => ({
        type: TOGGLE_INVALID_VALUE,
        payload: bool
    })      
}

export default actions