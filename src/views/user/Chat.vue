<template>
  <div class='container'>
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <!-- 聊天列表 -->
    <div class="chat-list" ref="list">
      <div class="chat-item" :class="{left:item.name==='xz',right:item.name==='self'}"  v-for="(item,i) in list" :key="i">
        <van-image v-if="item.name==='xz'" fit="cover" round :src="zxAvatar" />
        <div class="chat-pao">{{item.msg}}</div>
        <van-image v-if="item.name==='self'" fit="cover" round :src="photo" />
      </div>
    </div>
    <!-- 输入框 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <span @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
// 1. webpcak img的静态src指定的本地图片 打包。
import zxAvatar from '../../assets/xz.png'
import { mapState } from 'vuex'
import io from 'socket.io-client'
export default {
  name: 'user-chat',
  data () {
    return {
      // 输入框内容
      value: '',
      zxAvatar,
      // 聊天记录列表
      // 约定：小智 {name:'xz',msg:''} 自己 {name:'self',msg:''}
      list: [],
      socketio: null
    }
  },
  computed: {
    ...mapState(['photo', 'user'])
  },
  created () {
    // 1. 建立连接
    this.socketio = io('http://ttapi.research.itcast.cn', {
      query: {
        token: this.user.token
      }
    })
    this.socketio.on('connect', () => {
      // 2. 连接成功
      // 让小智给你打个招呼
      this.list.push({ name: 'xz', msg: '您想知道点啥？' })
    })
    // 4. 收消息
    this.socketio.on('message', (data) => {
      // 聊天记录
      this.list.push({ name: 'xz', msg: data.msg })
      this.scrollBottom()
    })
  },
  beforeDestroy () {
    this.socketio.close()
  },
  methods: {
    send () {
      if (!this.value) return false
      // 3. 发信息
      this.socketio.emit('message', { msg: this.value, timestamp: Date.now() })
      // 聊天记录
      this.list.push({ name: 'self', msg: this.value })
      this.value = ''
      this.scrollBottom()
    },
    scrollBottom () {
      this.$nextTick(() => {
        this.$refs.list.scrollTop = this.$refs.list.scrollHeight // 可滚动的高度
      })
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
