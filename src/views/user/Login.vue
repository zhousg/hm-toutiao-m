<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="登录"></van-nav-bar>
    <van-cell-group>
      <van-field v-model.trim="loginForm.mobile" :error-message="errMsg.mobile" @blur="checkMobile" label="手机号" placeholder="请输入手机号" />
      <van-field v-model.trim="loginForm.code" :error-message="errMsg.code" @blur="checkCode" label="验证码" placeholder="请输入验证码">
        <van-button class="p5" slot="button" size="mini" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn_box">
      <van-button type="info" @click="login" block round>登 录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      // 需要提交的数据
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      },
      // 错误提示对象
      errMsg: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    checkMobile () {
      // 1. 非空
      if (!this.loginForm.mobile) {
        // 错误提示
        this.errMsg.mobile = '请输入手机号'
        return false
      }
      // 2. 格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        // 错误提示
        this.errMsg.mobile = '手机号格式错误'
        return false
      }
      // 3. 成功
      this.errMsg.mobile = ''
    },
    checkCode () {
      // 1. 非空
      if (!this.loginForm.code) {
        // 错误提示
        this.errMsg.code = '请输入验证码'
        return false
      }
      // 2. 格式
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        // 错误提示
        this.errMsg.code = '验证码6个数字'
        return false
      }
      // 3. 成功
      this.errMsg.code = ''
    },
    ...mapMutations(['setUser']),
    async login () {
      // 整体表单校验
      this.checkMobile()
      this.checkCode()
      // 如何判断校验成功
      if (!this.errMsg.mobile && !this.errMsg.code) {
        // 校验成功
        // 1. 基于request封装登录的API
        // 2. 导入API
        // 3. 调用即可
        // 4. 获取用户信息
        // 5. 更新vuex中的user数据
        // 6. 根据地址栏进行跳转
        // 7. 提示 成功
        // 8. 失败 错误提示
        try {
          const data = await login(this.loginForm)
          // data  是对象  token  refresh_token
          this.setUser(data)
          this.$router.push(this.$route.query.redirectUrl || '/user')
          this.$toast.success('登录成功')
        } catch (e) {
          this.$toast.fail('用户名或验证码错误')
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
.p5{
  padding: 0 5px;
}
.btn_box{
  padding: 10px;
  .van-button{
    height: 32px;
    line-height: 30px;
  }
}
</style>
