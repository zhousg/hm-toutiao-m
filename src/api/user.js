// 定义用户相关的API
import request from '@/utils/request'

/**
 * 登录
 * @param {Object} loginForm - 登录用户信息（mobile,code）
 */
export const login = (loginForm) => {
  return request('/app/v1_0/authorizations', 'post', loginForm)
}

/**
 * 添加关注
 * @param {Integer} userId - 用户的ID
 */
export const followings = (userId) => {
  return request('/app/v1_0/user/followings', 'post', {
    target: userId
  })
}
/**
 * 取消关注
 * @param {Integer} userId - 用户的ID
 */
export const unFollowings = (userId) => {
  return request(`/app/v1_0/user/followings/${userId}`, 'delete')
}

/**
 * 获取 （个人中心-首页） 用户信息
 */
export const getUserInfo = () => {
  return request('/app/v1_0/user', 'get')
}
