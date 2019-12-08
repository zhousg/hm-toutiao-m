<template>
  <div id="app">
    <!-- 一级路由对应组件显示容器 -->
    <!-- 1. 当动态路由组件外面包裹了keep-alive就被缓存 -->
    <!-- 2. 当动态路由组件外面没了keep-alive就没有被缓存 -->
    <!-- 3. 判断当前访问的组件 如果是 首页和文章详情  放在keep-alive中 -->
    <!-- 4. $route获取路由信息 meta 元信息  isKeepAlive 判断依据 -->
    <keep-alive>
      <router-view v-if="$route.meta.isKeepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.isKeepAlive"></router-view>
  </div>
</template>

<style lang="less"></style>
