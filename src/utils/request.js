// 提供一个配置好的axios，导出一个调用接口的函数即可。
import axios from 'axios'
import JSONBIGINT from 'json-bigint'
import store from '@/store'
import router from '@/router'
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

// 响应拦截器 （响应成功：剥离无效数据，响应失败：刷新token）
instance.interceptors.response.use(res => {
  // 将来获取数据：res.data.data 麻烦
  // 我们想要结果：data 即可
  try {
    return res.data.data
  } catch (e) {
    return res
  }
}, async err => {
  // 跳转登录路由配置
  // 组件中：$route.path  模块中：router 是路由实例
  // 结论：router.currentRoute  ===  $route   router.currentRoute.path当前路由
  const loginConfig = { path: '/login', query: { redirectUrl: router.currentRoute.path } }
  try {
    // 目的：刷新token
    if (err.response && err.response.status === 401) {
    // 未登录  跳转登录页面  阻止程序运行
      const { user } = store.state
      // 如果没有token没登录  如果没有refresh_token无法刷新token
      if (!user.token || !user.refresh_token) {
        router.push(loginConfig)
        return Promise.reject(err)
      }
      // 刷新token 发请求  没有配置的axios  自己配置refresh_token
      const res = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // token获取  res.data.data.token
      // 更新 vuex 和 本地 token
      store.commit('setUser', {
        token: res.data.data.token,
        refresh_token: user.refresh_token
      })
      // 继续发送刚才错误的请求
      // instance({之前错误的请求配置})
      // err错误对象 包含（response 响应对象 |config 请求配置）
      return instance(err.config)
    }
  } catch (e) { // exception 异常
    // 刷新token失败
    router.push(loginConfig)
    return Promise.reject(e)
  }
  return Promise.reject(err)
})

// 导出一个使用axios发请求的函数即可
export default (url, method, data) => {
  // 使用配置好的axios来帮你发送请求，得到数据（返回promise）
  // 快捷调用 axios.get() axios.post() ...  完整调用 axios({请求配置})
  // 配置选项有：url 地址 method 请求方式 params get传参 data 其他方式传参 headers 头部传参
  return instance({
    url,
    method,
    // data 提交给后台的参数（params|data）选项需要判断
    // 往对象中动态插入属性  obj.name = 10  obj[变量|js表达式] = 10
    // 用户传入：get Get GET  处理：转换小写进行判断
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
