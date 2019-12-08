// 提供频道相关的API函数
import request from '@/utils/request'
import store from '@/store'
// 约定存储数据的KEY  约定存储的数据格式 数组[{id:'',name:''},。。。]
const KEY = 'hm-toutiao-m-87-channel'
/**
 * 获取我的频道列表 - （未登录：获取的是系统默认给的频道列表）
 */
export const getMyChannels = () => {
  // 获取我的频道有三种情况：
  // 1 已经登录   获取我的频道返回数据即可
  // 2 未登录：本地没有缓存频道数据，获取默认的频道，本地存储起来，返回默认数据。
  // 3 未登录：本地已经缓存频道数据，返回本地数据即可
  // 是返回一个promise对象，来返回数据的。
  return new Promise(async (resolve, reject) => {
    const { user } = store.state
    if (user.token) {
      // 情况1
      const data = await request('/app/v1_0/user/channels', 'get')
      resolve(data)
    } else {
      const localChannels = JSON.parse(window.localStorage.getItem(KEY) || '[]')
      if (!localChannels.length) {
        // 情况2
        const data = await request('/app/v1_0/user/channels', 'get')
        window.localStorage.setItem(KEY, JSON.stringify(data.channels))
        resolve(data)
      } else {
        // 情况3
        resolve({ channels: localChannels })
      }
    }
  })
}

/**
 * 删除频道
 * @param {Integer} channelId - 频道ID
 */
export const delChannel = (channelId) => {
  return new Promise(async (resolve, reject) => {
    const { user } = store.state
    if (user.token) {
      // 发接口进行删除
      await request(`/app/v1_0/user/channels/${channelId}`, 'delete')
      resolve()
    } else {
      // 从本地存储删除
      // 取出频道
      const localChannels = JSON.parse(window.localStorage.getItem(KEY) || '[]')
      // 删除频道
      localChannels.splice(localChannels.findIndex(item => item.id === channelId), 1)
      // 存入频道
      window.localStorage.setItem(KEY, JSON.stringify(localChannels))
      resolve()
    }
  })
}

/**
 * 添加频道
 * @param {Array} orderChannels - 排序好的频道数组
 */
export const addChannel = (orderChannels) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { user } = store.state
      if (user.token) {
      // 调用接口进行添加
        await request('/app/v1_0/user/channels', 'put', {
          channels: orderChannels
        })
        resolve()
      } else {
        // 通过本地进行添加
        const localChannels = JSON.parse(window.localStorage.getItem(KEY) || '[]')
        const { id, name } = orderChannels[orderChannels.length - 1]
        localChannels.push({ id, name })
        window.localStorage.setItem(KEY, JSON.stringify(localChannels))
        resolve()
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 获取全部频道列表
 */
export const getAllChannels = () => {
  return request('/app/v1_0/channels', 'get')
}
