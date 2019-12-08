<template>
  <van-popup :value="value" @input="$emit('input',$event)" @open="isReport=false">
    <van-cell-group v-if="!isReport">
      <van-cell @click="disLikes()">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell @click="report(item.value)" v-for="item in reports" :key="item.value">{{item.label}}</van-cell>
    </van-cell-group>
  </van-popup>
</template>

<script>
// 不感兴趣
// 1. 定义一个不感兴趣API接口
// 2. 获取当前点击的文章ID
// 3. 点击 不感兴趣 单元格 ， 调用接口
// 4. 成功 提示+关闭对话框+移除当前频道的文章列表对应的文章
// 5. 失败 错误提示
// 举报文章
// 1. 定义一个常量  渲染举报类型
// 2. 定义一个接口  举报操作
// 3. 点击 不同的举报类型 调用接口
// 4. 成功 提示+关闭对话框+移除当前频道的文章列表对应的文章
// 5. 失败 错误提示
import { disLikes, report } from '@/api/article'
import { reports } from '@/api/constants'
export default {
  props: {
    // 接收父组件 showMoreAction 数据
    value: {
      type: Boolean,
      default: false
    },
    // 当前点击的文章ID
    articleId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      // 控制van-popup组件的显示隐藏
      show: false,
      // 控制对话框状态（举报状态|不是举报）
      isReport: false,
      reports
    }
  },
  methods: {
    // 举报文章
    async report (type) {
      try {
        await report(this.articleId, type)
        this.$toast.success('举报成功')
        this.$emit('input', false)
        this.$emit('on-report')
      } catch (e) {
        if (e.response.status === 409) {
          return this.$toast.fail('已经举报')
        }
        this.$toast.fail('举报失败')
      }
    },
    // 不感兴趣
    async disLikes () {
      try {
        // 调用接口
        await disLikes(this.articleId)
        // 提示
        this.$toast.success('操作成功')
        // 关闭对话框
        this.$emit('input', false)
        // 通知父组件  删除对应的文章
        this.$emit('on-disLikes')
      } catch (e) {
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
