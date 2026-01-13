<template>
  <div id="app">
    <router-view />
    <!-- 准备挂载子应用的节点 -->
     <div id="bigContainer"></div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
