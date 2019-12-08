<template>
  <div class='container'>
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <!-- 搜索框 -->
    <van-search v-model.trim="q" placeholder="请输入搜索关键词" shape="round" @search="onSearch"/>
    <!-- 联想词条 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell @click="onSearch(item.replace(`<span>${q}</span>`,q))" v-for="item in options" :key="item" icon="search"><p v-html="item"></p></van-cell>
    </van-cell-group>
    <!-- 搜索历史 -->
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <van-icon name="delete" @click="clearHistory"></van-icon>
      </div>
      <van-cell-group>
        <van-cell v-for="(item,i) in historyList" :key="item">
          <a @click="toSearch(item)" class="word_btn">{{item}}</a>
          <van-icon @click="delHistory(i)" class="close_btn" slot="right-icon" name="cross"/>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
// 历史相关功能
// 1. 渲染历史列表
// 1.1 约定key  hm-toutiao-m-87-history
// 1.2 约定value  json格式的数组 ["电脑","123","abc"]
// 1.3 组件初始化 获取数据  模版中使用即可
// 2. 删除历史
// 2.1 绑定 name="cross" 点击事件 传入索引
// 2.2 根据索引进行删除即可，同时要更新本地存储
// 3. 点击历史文字 进入搜索结果
// 3.1 绑定 class="word_btn" 点击事件 传入 文字
// 3.2 根据文字 跳到搜索结果
// 4. 清空
// 4.1 绑定  name="delete" 点击事件
// 4.2  清空组件上的历史数据  同时  清空本地的历史数据
// 5. 进行搜索
// 5.1 已经有一个事件 @search 事件 触发了一个函数onSearch
// 5.2 默认传参是输入的文字
// 5.3 把文字当作历史 存储起来 （记录不能重复）
// 5.4 进行跳转搜索结果即可
// 联想建议相关功能
// 1. 把api封装好，获取后台推荐的词条
// 2. 当输入的内容发生改变，调用接口获取词条
// 3. 在data中有数据来记录词条，模版中渲染
import { suggest } from '@/api/article'
const KEY = 'hm-toutiao-m-87-history'
export default {
  name: 'search-index',
  data () {
    return {
      // 搜索关键字
      q: '',
      // 历史搜索列表
      historyList: JSON.parse(window.localStorage.getItem(KEY) || '[]'),
      // 词条
      options: [],
      // 计时器
      timer: null
    }
  },
  watch: {
    q () {
      if (!this.q) {
        window.clearTimeout(this.timer)
        return false
      }
      // 输入内容改变的时候执行该函数
      // 需求：当用户停止输入后500ms后发请求，如果500ms内再次输入内容，重新计时。
      // 函数防抖
      window.clearTimeout(this.timer)
      this.timer = window.setTimeout(async () => {
        const data = await suggest(this.q)
        this.options = data.options.map(item => item.toLowerCase().replace(this.q, `<span>${this.q}</span>`))
      }, 500)
    }
  },
  methods: {
    onSearch (key) {
      // PC端当按下回车键触发，M端点击虚拟键盘中的 enter键|搜索键 触发
      // key 当前输入的文字
      if (!key) return false
      // 1. 存储本地
      const set = new Set(this.historyList)
      set.add(key)
      this.historyList = [...set] // Array.from(set) set转换数组
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
      // 2. 跳转搜索
      this.$router.push({ path: '/search/result', query: { q: key } })
    },
    // 删除
    delHistory (index) {
      // 组件中删除
      this.historyList.splice(index, 1)
      // 本地中删除
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
    },
    // 去搜索
    toSearch (key) {
      // key 搜索关键字
      this.$router.push({ path: '/search/result', query: { q: key } })
    },
    // 清空历史
    clearHistory () {
      this.historyList = []
      window.localStorage.removeItem(KEY)
    }
  }
}
</script>

<style scoped lang='less'>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
