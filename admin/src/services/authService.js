import api from './api'

export const login = (credentials)=> api.post('/auth/login', credentials)

export const setToken = (token)=> localStorage.setItem('jwt', token)
export const removeToken = ()=> localStorage.removeItem('jwt')
export const getToken = ()=> localStorage.getItem('jwt')
