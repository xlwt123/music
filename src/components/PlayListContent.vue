<template>
  <div class="play-list-content">
    <ul class="list-content d-flex jc-between p-0 flex-wrap">
      <li v-for="item of list" :key="item.id" class="list-item" @click="toDetail(item.id)">
        <div class="item-img flex-1">
          <img v-lazy="item.picUrl||item.coverImgUrl" :alt="item.name" class="w-100" @load="loadImg"/>
        </div>
        <div class="item-title my-2 mx-1 fs-s">
          <span>{{item.name}}</span>
        </div>
        <div class="playCount fs-s text-text">
          <i class="iconfont icon-play-1 pr-1 fs-s"></i>
          <span>{{normalizePlayCount(item.playCount)}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: null
    }
  },
  methods: {
    loadImg() {
      this.$emit('loaded')
    },
    toDetail(id) {
      this.$router.push(`/playlist/${id}`)
    },
    normalizePlayCount(count) {
      if (count < 10000) {
        return count
      } else if (count < 100000000) {
        return `${Math.floor(count/10000)}万`
      } else {
        return `${Math.floor(count/100000000)}亿`
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.list-item {
  position: relative;
  list-style: none;
  width: 32%;
  z-index: 10;
  .item-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.2;
  }
  .playCount {
    position: absolute;
    bottom: 50px;
    left: 5px;
  }
}
</style>