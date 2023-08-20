import axios from 'axios'
import platformConfig from './PlatformConfig'

axios.defaults.baseURL = platformConfig.baseURL
axios.interceptors.request.use(config => {
  config.headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-header': '*',
    authorization: localStorage.getItem('whospay_id_token') || ''
  }
  const token = localStorage.getItem('whospay_id_token') || ''
  if (token) {
    config.headers.authorization = token
  }
  return config
}, err => {
  return Promise.reject(err)
})

export default axios