<template>
  <div class="search-list">
    <ul class="list m-0 p-0">
      <li class="item d-flex ai-center" v-for="(item, index) of list" :key="index">
        <p class="text fs-m text-text-l flex-1" @click="selectItem(item)">{{item}}</p>
        <i class="iconfont icon-delete fs-s text-text-l" @click.stop="delectItem(item)"></i>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('selectItem', item)
    },
    delectItem(item) {
      this.$emit('delectItem', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  list-style: none;
}
</style>