<template>
  <div ref="container" class='container' @scroll="remember($event)">
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <!-- 详情容器 -->
    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate|relTime}}</p>
        </div>
        <van-button @click="toggleFollowings" round size="small" type="info">
          {{article.is_followed?'已关注':'+ 关注'}}
        </van-button>
      </div>
      <div class="content" v-html="article.content"></div>
      <div class="zan">
        <van-button @click="toggleAttitude(1)" round size="small" :class="{active:article.attitude===1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button @click="toggleAttitude(0)" round size="small" :class="{active:article.attitude===0}" plain icon="delete">不喜欢</van-button>
      </div>
      <!-- 评论区域 -->
      <comment></comment>
    </div>
  </div>
</template>

<script>
// 渲染文章详情
// 1. 封装API获取文章数据
// 2. 在组件激活的时候 调用API
// 3. 条件：当前访问的文章和之前访问的文章不同的时候
// 4. 如果相同：滚动到之前阅读的位置
// 5. 渲染界面

// 添加关注与取消关注
// 1. 封装API对作者进行关注和取消 2接口
// 2. 点击 已关注|+ 关注 按钮调用接口
// 3. 成功：提示 按钮状态改变
// 4. 异常处理

// 点赞 取消点赞  不喜欢  取消不喜欢
// 1. 封装API 4接口
// 2. 绑定  点赞按钮 传参1  不喜欢按钮 传参0  同一个处理函数
// 3. 在函数中判断  点击是哪个按钮
// 4. 调用对应的接口
// 5. 成功：提示  按钮状态的改变
// 6. 处理异常

import { getArticle, disLikes, unDisLikes, likings, unLikings } from '@/api/article'
import { followings, unFollowings } from '@/api/user'
import Comment from './components/comment'
export default {
  name: 'home-article',
  components: { Comment },
  data () {
    return {
      // 文章详情
      article: {
        art_id: ''
      },
      // 阅读位置
      scrollTop: 0
    }
  },
  activated () {
    // 当前访问的文章ID this.$route.params.id
    // 之前访问的文章ID this.article.art_id.toString()
    if (this.$route.params.id !== this.article.art_id.toString()) {
      // 重置位置
      this.scrollTop = 0
      // 发请求获取数据
      this.getArticle()
    } else {
      this.$refs.container.scrollTop = this.scrollTop
    }
  },
  methods: {
    // 切换态度
    async toggleAttitude (btnType) {
      try {
        if (btnType === 1) {
          if (this.article.attitude === 1) {
          // 操作：取消点赞
            await unLikings(this.article.art_id)
            this.article.attitude = -1
          } else {
          // 操作：点赞
            await likings(this.article.art_id)
            this.article.attitude = 1
          }
        } else {
          if (this.article.attitude === 0) {
          // 操作：取消不喜欢
            await unDisLikes(this.article.art_id)
            this.article.attitude = -1
          } else {
          // 操作：不喜欢
            await disLikes(this.article.art_id)
            this.article.attitude = 0
          }
        }
        this.$toast.success('操作成功')
      } catch (e) {
        this.$toast.fail('操作失败')
      }
    },
    // 切换 添加关注 和 取消关注
    async toggleFollowings () {
      try {
        if (this.article.is_followed) {
        // 操作：取消关注
          await unFollowings(this.article.aut_id)
          this.$toast.success('取消关注成功')
          this.article.is_followed = false
        } else {
        // 操作：添加关注
          await followings(this.article.aut_id)
          this.$toast.success('添加关注成功')
          this.article.is_followed = true
        }
      } catch (e) {
        this.$toast.fail('操作失败')
      }
    },
    // 获取文章信息
    async getArticle () {
      const data = await getArticle(this.$route.params.id)
      this.article = data
    },
    // 记录滚动位置
    remember (e) {
      this.scrollTop = e.target.scrollTop
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  // height: 1000%;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  // 内容中包含：img 特别宽  code pre 不能换行
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
    /deep/ pre{
      white-space: pre-wrap;
    }
  }
}
</style>
