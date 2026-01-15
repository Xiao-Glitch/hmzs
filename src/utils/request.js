import axios from 'axios'
import { getToken } from './auth'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/v1',
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加token
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    if (response.data.code === 50000) {
      return Message({
        type: 'warning',
        message: response.data.msg
      })
    } else {
      return response.data
    }
  },
  // 接口错误回调
  error => {
    Message({
      type: 'warning',
      message: error.response.data.msg
    })
    return Promise.reject(error)
  }
)

export default service
