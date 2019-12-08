// 封装一个基于VUE的插件
// 插件中：挂载原型函数  注册组件  过滤器  自定义指令

// 定义插件的固定格式是：导出一个对象，对象中必须有install属性，指向一个函数
// 函数中默认传入 Vue 构造函数 ，基于 Vue 来扩展功能
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)

const sleep = () => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, 1500)
  })
}

// value 是使用过滤器 管道符前js表达式的执行结果
const relTime = (value) => {
  // 对value日期数据进行转换 使用插件进行相对时间转换
  // 有插件 moment 处理日期格式的  体积较大
  // 有插件 dayjs  处理日期格式的  较为轻量
  return dayjs().locale('zh-cn').from(value)
}

export default {
  install (Vue) {
    // 基于 Vue 来扩展功能
    Vue.prototype.$sleep = sleep
    // 过滤器
    Vue.filter('relTime', relTime)
  }
}
