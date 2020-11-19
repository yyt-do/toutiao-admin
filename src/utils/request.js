// 基于axios封装的请求模块
import axios from 'axios'
import JSONbig from 'json-bigint'
// 创建一个axios实例
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 定义后端返回的原始数据的处理
  // 参数 data 就是后端返回的原始数据（未经处理的 JSON 格式字符串）
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    // console.log(data)

    // 后端返回的数据可能不是 JSON 格式字符串
    // 如果不是的话，那么 JSONbig.parse 调用就会报错
    // 所以我们使用 try-catch 来捕获异常，处理异常的发生
    try {
      // 如果转换成功，则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      console.log('转换失败', err)
      // 如果转换失败了，则进入这里
      // 我们在这里把数据原封不动的直接返回给请求使用
      return data
    }

    // axios 默认在内部使用 JSON.parse 来转换处理原始数据
    // return JSON.parse(data)
  }]
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
