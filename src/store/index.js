import Vue from 'vue'
import Vuex from 'vuex'

import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息（token,refresh_token）
    user: auth.getUser()
  },
  mutations: {
    // 修改用户信息
    setUser (state, user) {
      // 修改state数据
      state.user = user
      // 修改本地数据
      auth.setUser(user)
    },
    // 删除用户信息
    delUser (state) {
      // 删除state数据
      state.user = {}
      // 删除本地数据
      auth.delUser()
    }
  },
  actions: {
  }
})
