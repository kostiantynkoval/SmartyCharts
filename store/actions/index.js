import axios from 'axios'
import { AsyncStorage } from 'react-native'
import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL,
  LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAIL,
  GET_SKILLS_REQUEST, GET_SKILLS_SUCCESS, GET_SKILLS_FAIL
} from './actionTypes'

getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('token');
    if (value !== null) {
      return value;
    } else {
      console.log('Error fetching token unknown')
      return false
    }
  } catch (error) {
    // Error retrieving data
    console.log('Error fetching token: ', error)
    return false
  }
}

const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.151:3010',
  // headers: {
  //   Authorization: `Bearer ${getToken()}`
  // }
})

// Action Creators

export const login = (data) => async dispatch => {
  dispatch(actionRequested(LOGIN_REQUEST))

  return axiosInstance
    .post(`/api/login`, data)
    .then(res => {
      if(res.data.success) {
        return dispatch(actionSucceed(LOGIN_SUCCESS, res.data.token))
      }
      return dispatch(actionFailed(LOGIN_FAIL, 'Unknown Error'))
    })
    .catch(err => {
      return dispatch(actionFailed(LOGIN_FAIL, `Error : ${err}`))
    })
}

export const logout = (message = '') => dispatch => dispatch(actionSucceed(LOGOUT_SUCCESS, message))

export const getSkills = () => (dispatch, getState) => {
  dispatch(actionRequested(GET_JOBS_REQUEST))
  const { network: { isConnected }, auth: { token } } = getState()

  if(isConnected) {
    axiosInstance
      .get(`/staff/tasks`, {headers: { Authorization: token }})
      .then(res => {
        dispatch(actionSucceed(GET_JOBS_SUCCESS, res.data))
      })
      .catch(err => {
        if (err.response.data.error && [15,20,16,4].includes(err.response.data.error.msg)) {
          dispatch(actionFailed(GET_JOBS_FAIL, 'Ошибка авторизации'))
          return dispatch(logout('Ошибка авторизации. Возможно ваша сессия истекла. Пожалуйста авторизируйтесь заново'))
        }
        else if (err.message === 'Network Error') {
          dispatch(actionFailed(GET_JOBS_FAIL, 'Ошибка соединения с сервером. Попробуйте позже. Разнарядки будут взяты из памяти устройства'))
        }
        else {
          dispatch(actionFailed(GET_JOBS_FAIL, 'Неизвестная ошибка. Попробуйте позже. Разнарядки будут взяты из памяти устройства'))
        }
      })

  } else {
    return dispatch(actionFailed(GET_JOBS_FAIL, "Отсутствует связь с интернетом. Разнарядки будут взяты из памяти устройства"))
  }
}

// Actions
const actionRequested = (type) => ({type})
const actionSucceed = (type, payload) => ({type, payload})
const actionFailed = (type, payload) => ({type, payload})