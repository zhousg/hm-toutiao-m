<template>
  <div class='container'>
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" @click-right="save()"></van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'user-profile',
  methods: {
    save () {

    }
  }
}
</script>

<style scoped lang='less'></style>
