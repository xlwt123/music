<template>
  <div class="header text-text text-center bg-bg">
    <div class="title mt-2">
    </div>
    <router-link tag="div" class="mine" to="/user">
      <i class="iconfont icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
.header {
  height: 48px;
  .title {
    display: inline-block;
    background: url('../assets/images/topbar.png') no-repeat 0 -19px;
    width: 157px;
    height: 33px;
  }
  .mine {
    display: inline-block;
    line-height: 48px;
    vertical-align: top;
    position: absolute;
    right: 15px;
  }
}
</style>