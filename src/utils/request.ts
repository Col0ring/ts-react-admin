import axios from 'axios'
import { message } from 'antd'

const service = axios.create({
  baseURL: '/api/',
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    return config
  },
  err => {
    message.error(err.message)
    return new Promise(() => {})
  }
)

service.interceptors.response.use(
  response => {
    const { status, msg } = response.data
    if (status === 0) {
      return response
    } else {
      message.error(msg)
      return false as any
    }
  },
  err => {
    message.error(err.message)
    return new Promise(() => {})
  }
)

export default service
