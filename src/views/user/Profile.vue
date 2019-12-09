<template>
  <div class='container'>
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" @click-right="save()"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" @click="showPhoto=true" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          :src="photo"
        />
      </van-cell>
      <van-cell is-link title="名称" @click="showName=true" :value="user.name" />
      <van-cell is-link title="性别" @click="showGender=true" :value="user.gender===0?'男':'女'" />
      <van-cell is-link title="生日" @click="openDate()" :value="user.birthday" />
    </van-cell-group>
    <!-- 头像对话框 -->
    <van-popup v-model="showPhoto" position="bottom">
      <van-cell @click="$refs.fileInput.click()" value="本地相册选择" is-link/>
      <van-cell value="拍照" is-link/>
    </van-popup>
    <!-- 用户名称对话框 -->
    <van-popup v-model="showName" position="bottom">
      <van-field v-model="user.name" required placeholder="请输入用户名" />
    </van-popup>
    <!-- 性别对话框 -->
    <van-popup v-model="showGender" position="bottom">
      <van-cell value="男" @click="changeGender(0)" is-link/>
      <van-cell value="女" @click="changeGender(1)" is-link/>
    </van-popup>
    <!-- 生日选择 -->
    <van-popup v-model="showBirthday" position="bottom">
      <van-datetime-picker
        title="选择生日"
        v-model="nowDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showBirthday=false"
        @confirm="confirmDate"
      />
    </van-popup>
    <input @change="preview()" style="display:none" ref="fileInput" type="file">
  </div>
</template>

<script>
// 保存用户信息（头像|信息）
// 1. 封装三个接口 修改头像  修改信息  获取用户信息
// 2. 组件初始化 获取用户信息API
// 3. 选择头像：预览 关闭对话框
// 4. 点击 保存 按钮
// 4.1 上传头像
// 4.2 保存用户信息
// 5. 成功 提示
// 6. 异常处理
import dayjs from 'dayjs'
import { getUserProfile, updateUserPhoto, updateUserInfo } from '@/api/user'
export default {
  name: 'user-profile',
  data () {
    return {
      // 打开 头像上传  选择对话框
      showPhoto: false,
      // 打开  输入用户名称 对话框
      showName: false,
      // 打开  选择性别  对话框
      showGender: false,
      // 打开 生日 对话框
      showBirthday: false,
      // 日期控件 默认时间
      nowDate: new Date(),
      // 日期控件 最小可选日期
      minDate: new Date('1949-10-01'),
      // 日期控件 最大可选日期
      maxDate: new Date(),
      // 头像
      photo: null,
      // 用户信息
      user: {
        name: '',
        gender: 0,
        birthday: ''
      }
    }
  },
  created () {
    this.getUserProfile()
  },
  methods: {
    // 预览
    preview () {
      // 如何实现预览
      // file 对象  src 不能读取 Obejct 显示为图片
      // src 使用本地地址|网络路径   base64编码数据
      // FileReader 对象，根据file读取base64编码数据
      const fileReader = new FileReader()
      fileReader.readAsDataURL(this.$refs.fileInput.files[0])
      fileReader.onload = () => {
        // 读取完毕  result base64编码数据
        this.photo = fileReader.result
        this.showPhoto = false
      }
    },
    // 获取用户信息
    async getUserProfile () {
      const data = await getUserProfile()
      this.photo = data.photo
      this.user = data
    },
    // 选择性别
    changeGender (gender) {
      this.user.gender = gender
      this.showGender = false
    },
    // 打开生日对话框
    openDate () {
      // 使用后端给的生日数据 让日期控件选中
      if (this.user.birthday) {
        this.nowDate = new Date(this.user.birthday)
      }
      this.showBirthday = true
    },
    // 确认时间
    confirmDate () {
      // 使用选中的时间  填充单元格
      this.user.birthday = dayjs(this.nowDate).format('YYYY-MM-DD')
      // 关闭对话框
      this.showBirthday = false
    },
    async save () {
      try {
        // 1. 修改用户头像
        await updateUserPhoto(this.$refs.fileInput.files[0])
        // 2. 修改用户信息
        await updateUserInfo(this.user)
        this.$toast.success('保存成功')
      } catch (e) {
        this.$toast.fail('保存失败')
      }
    }
  }
}
</script>

<style scoped lang='less'></style>
