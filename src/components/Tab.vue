<template>
  <div class="tab d-flex jc-around fs-m text-text-l">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link pb-1">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link pb-1">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/mv">
      <span class="tab-link pb-1">MV</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link pb-1">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
}
</script>

<style lang="scss" scoped>
.tab {
  height: 44px;
  line-height: 44px;
  .router-link-active {
    .tab-link {
      color: #ffcd32;
      border-bottom: 2px solid #ffcd32;
    }
  }
}
</style>