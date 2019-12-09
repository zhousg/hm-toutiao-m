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

/**
 * 获取 （个人中心-编辑资料） 用户信息
 */
export const getUserProfile = () => {
  return request('/app/v1_0/user/profile', 'get')
}

/**
 * 修改用户头像
 * @param {File} photo - 选中图片后的文件对象
 */
export const updateUserPhoto = (photo) => {
  // 底层基于xhr  发送一个formdata就是上传
  const formdata = new FormData()
  formdata.append('photo', photo)
  return request('/app/v1_0/user/photo', 'patch', formdata)
}

/**
 * 修改用户信息
 * @param {String} name - 用户名
 * @param {Integer} gender - 性别 0 男 1 女
 * @param {String} birthday - 生日
 */
export const updateUserInfo = ({ name, gender, birthday }) => {
  return request('/app/v1_0/user/profile', 'patch', { name, gender, birthday })
}
