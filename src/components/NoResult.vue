<template>
  <div class="no-result text-center">
    <p class="fs-m text-text-l">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '暂无搜索结果'
    }
  }
}
</script>

<style lang="scss" scoped>
  p {
    display: inline-block;
  }
</style>