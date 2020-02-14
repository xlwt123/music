<template>
  <div class="user w-100">
    <div class="header">
      <div class="back text-center fs-xm" @click="back">
        <i class="iconfont icon-back text-theme"></i>
      </div>
      <div class="title fs-xm text-text w-100 text-center">个 人 中 心</div>
    </div>
    <div class="tabs d-flex jc-around fs-m text-text-l">
      <div class="tab-item" v-for="(item,index) in tabs" :class="{'active':currentIndex === index}" @click="switchItem(index)" :key="index">
        <span class="tab-link pb-1">{{item}}</span>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: ['最近播放', '我的歌单'],
      currentIndex: 0
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    switchItem(i) {
      this.currentIndex = i
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 10;
  background: #222;
  .header {
    height: 48px;
    line-height: 48px;
    .back {
      position: absolute;
      left: 0;
      top: 0;
      width: 30px;
    }
  }
  .tabs {
    width: 60%;
    margin: 0 auto;
    border: 2px solid #333;
    line-height: 30px;
    border-radius: 5px;
    .active {
      color: #fff;
    }
  }
}
</style>