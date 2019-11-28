// 提供一个配置好的axios，导出一个调用接口的函数即可。
import axios from 'axios'
import JSONBIGINT from 'json-bigint'
import store from '@/store'
// axios支持4个功能：
// 1. js最大安全数值处理
// 2. 头部需要携带token
// 3. 统一剥离无效数据，得到data
// 4. token失效，刷新token
const instance = axios.create({
  // 基准地址
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 格式转换  json-bigint
  transformResponse: [data => {
    // data 是原始的响应数据（json字符串|null）
    try {
      return JSONBIGINT.parse(data)
    } catch (e) {
      return data
    }
  }]
})

// 请求拦截器
instance.interceptors.request.use(config => {
  // 修改配置（头部需要携带token）
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, err => {
  // axios错误一定需要返回一个错误的promise对象
  return Promise.reject(err)
})

// 导出一个使用axios发请求的函数即可
