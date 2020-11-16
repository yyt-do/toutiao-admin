// 基于axios封装的请求模块
import axios from 'axios'
// 创建一个axios实例
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})
// 请求拦截器
request.interceptors.request.use(
  // 任何请求经过这里
  function(config) {
    // config 是当前请求的相关配置信息
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  // 请求失败经过这里
  function(error) {
    return Promise.reject(error)
  }
)
// 到处模块
export default request
