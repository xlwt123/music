<template>
  <div class="loading w-100 text-center">
    <img width="24" height="24" src="../assets/images/loading.gif">
    <p class="desc fs-s text-text-l mb-3">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '正在加载'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>