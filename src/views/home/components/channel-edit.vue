<template>
  <!-- 显示隐藏的控制是父组件 -->
  <!-- @closed="editing=false" 关闭菜单 重置编辑状态 -->
  <van-action-sheet
    :value="value"
    @input="$emit('input', $event)"
    @closed="editing=false"
    title="编辑频道"
  >
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,i) in myChannels" :key="item.id">
          <span @click="enterChannel(i)" class="f12" :class="{red:activeIndex===i}">{{item.name}}</span>
          <van-icon @click="delChannel(i,item.id)" v-show="editing && i!==0" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon @click="addChannel(item)" class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>

<script>
// 渲染可选频道
// 1. 定义API  获取全部频道
// 2. 在组件初始化 获取全部频道
// 3. 在data中记录全部频道
// 4. 可选频道（计算属性） = 全部频道 - 我的频道
// 5. 渲染即可
// 点击进入频道
// 1. 绑定我的频道点击事件
// 2. 关闭对话框
// 3. 把当前点击频道的索引传递给父组件，修改activeIndex的值
// 删除频道
// 1. 绑定删除按钮的点击事件（频道ID）
// 2. 调用接口进行删除
// 3. 成功：提示+删除我的频道数据中对应的频道
// 4. 当删除的频道索引 小于等于 当前激活的频道索引  让当前激活的索引减一
// 5. 失败：错误提示
// 添加频道
// 1. 绑定添加按钮的点击事件（ID,名称）
// 2. 准备  API接口  需要的数据
// 3. 封装API接口  提供点击使用
// 4. 成功：提示 + 把频道追加到组件上
// 5. 失败：错误提示
import { getAllChannels, delChannel, addChannel } from '@/api/channel'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 我的频道
    myChannels: {
      type: Array,
      default: () => []
    },
    // 激活频道的索引
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 控制 编辑状态（默认不编辑）
      editing: false,
      // 全部频道
      allChannels: []
    }
  },
  computed: {
    // 可选频道
    optionalChannels () {
      // 可选频道（计算属性） = 全部频道 - 我的频道
      // 减法逻辑：
      // 1. 先遍历全部频道，拿着当前遍历的频道的ID，去我的频道中查找有没有相同ID的频道
      // 2. 查到了相同的频道ID  排除不要
      // 3. 查询不到频道的ID  这就是可选频道  追加到新数组中即可
      // Array.filter() 根据原有的数组，进行遍历，根据条件（回调函数返回值true|false）追加选项到新数组中。
      return this.allChannels.filter(item => {
        return this.myChannels.findIndex(myItem => myItem.id === item.id) === -1
      })
    }
  },
  created () {
    this.getAllChannels()
  },
  methods: {
    // 添加频道
    async addChannel (item) {
      // 1. 本地添加频道  需要数据 {id:'',name:''}
      // 2. 后台添加频道  需要数据 [{id,seq:1},{id,seq:2},...] 不包含推荐
      // 3. 结论：调用接口（支持两种情况）传入的数据包含两种数据
      // 4. 最终：[{id,seq,name},...] 最后一项中的ID和NAME就是本地需要的
      const orderChannels = this.myChannels.map((item, i) => {
        return {
          id: item.id,
          name: item.name,
          seq: i
        }
      })
      // 追加当前点击的频道
      orderChannels.push({ seq: orderChannels.length, ...item })
      // 删除推荐
      orderChannels.shift()
      try {
        // 调用接口进行添加
        await addChannel(orderChannels)
        // 提示
        this.$toast.success('添加成功')
        // 组件中添加频道
        this.myChannels.push({
          id: item.id,
          name: item.name,
          upLoading: false,
          downLoading: false,
          finished: false,
          articles: [],
          timestamp: Date.now(),
          // 阅读位置
          scrollTop: 0
        })
      } catch (e) {
        this.$toast.fail('添加失败')
      }
    },
    // 删除频道
    async delChannel (index, channelId) {
      await delChannel(channelId)
      // 提示
      this.$toast.success('删除成功')
      // 当前激活频道的索引需要修改
      if (index <= this.activeIndex) {
        this.$emit('update:activeIndex', this.activeIndex - 1)
      }
      // 删除当前索引对应的频道数据（父组件myChannels）
      // 父传子的数据是单向的，仅仅可以读取，不能修改
      // 不能修改（简单数据类型：不能修改，复杂数据类型：不能修改引用地址）
      // 大白话：如果传递的是复杂数据类型，我可以修改值，不能重新赋值。
      this.myChannels.splice(index, 1)
    },
    // 点击进入频道
    enterChannel (index) {
      // 通知父组件  关闭对话框
      this.$emit('input', false)
      // 通知父组件  修改activeIndex的值
      this.$emit('update:activeIndex', index)
    },
    // 获取全部频道
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    }
  }
}
</script>

<style scoped lang='less'>
.van-popup--bottom{
  &.van-popup--round{
    border-radius: 0;
  }
}
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.channel {
  padding: 10px;
  .tit{
    line-height: 3;
    .tip {
      font-size: 10px;
      color: #999;
    }
  }
  .van-button {
    float: right;
    margin-top: 7px;
  }
  .btn{
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12{
      font-size:12px;
      color: #555;
  }
  .red{
    color: red;
  }
}
</style>
