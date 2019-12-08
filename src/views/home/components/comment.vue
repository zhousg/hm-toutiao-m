<template>
  <div class="comment">
    <!-- 评论列表 -->
    <van-list :immediate-check="false" @load="loadComments" v-model="loading" :finished="finished" finished-text="没有更多评论了">
      <div class="item van-hairline--bottom van-hairline--top" v-for="item in comments" :key="item.com_id.toString()">
        <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
        <div class="info">
          <p>
            <span class="name">{{item.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{item.like_count}}</span>
            </span>
          </p>
          <p>{{item.content}}</p>
          <p>
            <span class="time">{{item.pubdate|relTime}}</span>&nbsp;
            <van-tag plain @click="openReplyDialog(item.com_id.toString())">{{item.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 底部输入框 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" :placeholder="showReply?'写回复...':'写评论...'">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span @click="submit()" class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 回复 -->
    <van-action-sheet v-model="showReply" class="reply_dailog" title="回复评论">
      <van-list @load="loadReplys" :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多回复了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p><span class="name">{{item.aut_name}}</span></p>
            <p>{{item.content}}</p>
            <p><span class="time">{{item.pubdate|relTime}}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>
</template>

<script>
// 渲染评论列表
// 1. 定义获取评论列表的API
// 2. 在组件激活的时候 去获取评论数据 （每次就是最新评论）
// 3. @load事件会在组件初始化的时候 禁用：默认触发一次  上拉加载 去获取评论数据
// 4. 去获取评论数据 定义成函数  给 激活的时候和上拉加载去调用
// 5. 渲染完事

// 渲染回复列表
// 1. getCommentsOrReplys 使用它获取数据
// 2. 在点击回复 打开回复列表的时候 获取数据
// 3. 禁用：默认触发一次 @load事件 上拉加载 去获取评论数据
// 4. 去获取回复数据 定义成函数  给 打开回复列表和上拉加载去调用
// 5. 渲染完事

// 提交 评论或者回复
// 1. 定义API 评论或者回复
// 2. 点击 提交按钮的时候  调用API
// 3. 如何判断？根据对话框是否显示  操作  隐藏-->评论   显示-->回复
// 4. 提交前 开启 提交效果 van-loading 组件
// 5. 发请求
// 6. 成功：提示 + 关闭 提交效果 + 在当前列表顶部追加 一条数据  如果做回复，评论列表上的数量累加
// 7. 处理异常 提示 + 关闭 提交效果

import { getCommentsOrReplys, commentOrReply } from '@/api/article'
export default {
  data () {
    return {
      // 评论列表加载中状态
      loading: false,
      // 评论列表完全加载完毕状态
      finished: false,
      // 评论列表的偏移量
      offset: null,
      // 评论列表
      comments: [],
      // 输入的内容
      value: '',
      // 提交 评论或者回复 中
      submiting: false,
      // 控制回复列表的显示隐藏
      showReply: false,
      // 回复数据
      reply: {
        loading: false,
        finished: false,
        offset: null,
        list: []
      },
      // 当前点击的评论
      commentId: null
    }
  },
  activated () {
    // 清空上一篇文章的评论
    this.comments = []
    // 开启加载中效果
    this.loading = true
    // 重置 是否完全加载完毕 状态
    this.finished = false
    // 重置 偏移量
    this.offset = null
    this.loadComments()
  },
  methods: {
    // 提交 评论或者回复
    async submit () {
      // 判断是否有输入内容
      if (!this.value) return false
      // 开启提交效果
      this.submiting = true
      await this.$sleep()
      try {
        if (this.showReply) {
        // 回复
          const data = await commentOrReply(this.commentId, this.value, this.$route.params.id)
          this.$toast.success('回复成功')
          // 在回复列表顶部追加一项数据 data.new_obj
          this.reply.list.unshift(data.new_obj)
          // 在当前回复的评论数据中 累加回复的数量
          const comment = this.comments.find(item => item.com_id.toString() === this.commentId)
          comment.reply_count++
        } else {
        // 评论
          const data = await commentOrReply(this.$route.params.id, this.value)
          this.$toast.success('评论成功')
          this.comments.unshift(data.new_obj)
        }
        // 关闭提交效果
        this.submiting = false
        // 清空内容
        this.value = ''
      } catch (e) {
        this.$toast.success('操作失败')
        this.submiting = false
      }
    },
    // 打开回复列表
    openReplyDialog (comId) {
      this.showReply = true
      this.commentId = comId

      // 清空 回复 列表
      this.reply.list = []
      // 开启加载效果
      this.reply.loading = true
      // 重置 没有更多数据
      this.reply.finished = false
      // 重置 偏移量
      this.reply.offset = null
      this.loadReplys()
    },
    // 加载回复列表
    async loadReplys () {
      await this.$sleep()
      const data = await getCommentsOrReplys({
        type: 'c',
        source: this.commentId,
        offset: this.reply.offset
      })
      this.reply.list.push(...data.results)
      // 结束加载状态
      this.reply.loading = false
      // 判断是否还有数据
      if (data.last_id > data.end_id) {
        this.reply.offset = data.last_id
      } else {
        this.reply.finished = true
      }
    },
    // 加载评论列表
    async loadComments () {
      await this.$sleep()
      const data = await getCommentsOrReplys({
        type: 'a',
        source: this.$route.params.id,
        offset: this.offset
      })
      this.comments.push(...data.results)
      // 结束加载状态
      this.loading = false
      // 判断是否有数据
      if (data.last_id > data.end_id) {
        this.offset = data.last_id
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang='less'>
// 评论列表
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      width: 100%;
      overflow: hidden;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
// 输入框
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
// 回复列表
.van-popup--bottom{
  &.van-popup--round{
    border-radius: 0;
  }
}
.reply_dailog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>
