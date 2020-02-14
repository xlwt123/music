<template>
  <div class="play-list w-100" ref="content">
    <div class="header">
      <div class="back text-center fs-xm" @click="handleBack">
        <i class="iconfont icon-back text-theme"></i>
      </div>
      <div class="title fs-xm text-text w-100 text-center">歌 单 广 场</div>
    </div>
    <div class="tabs">
      <slider v-if="categories.length" ref="slider">
        <div
          v-for="category of categories"
          :key="category.id"
          class="text-center fs-m text-text-l tab-item"
          @click="categoryChange(category.name)"
          :class="cat===category.name?'item-active slider-item':'slider-item'"
        >{{category.name}}</div>
      </slider>
    </div>
    <scroll :data="playLists" class="scroll-wrapper w-100 mt-2" :pullup="true" ref="scroll" @scrollToEnd="loadMore">
      <div class="play-list-all">
        <play-list-content :list="playLists" @loaded="handleLoadImg"></play-list-content>
        <div class="text-center text-text-l fs-m pb-3" v-show="!addMore">加载更多</div>
        <loading v-show="addMore" title="" ref="loading"></loading>
      </div>       
    </scroll>
  </div>
</template>

<script>
import Scroll from "@/components/Scroll"
import Slider from '@/components/Slider'
import PlayListContent from '@/components/PlayListContent'
import Loading from "@/components/Loading"
import { ERR_OK } from "../api/config"
import { playListMixin } from '../assets/js/mixin'
import playListApi from "../api/playList"
export default {
  mixins: [playListMixin],
  components: {
    Scroll,
    Loading,
    Slider,
    PlayListContent
  },
  data() {
    return {
      categories: [],
      cat: "华语",
      playLists: [],
      addMore: true,
      offset: {},
      needLoad: true,
    }
  },
  methods: {
    _getCategories() {
      playListApi.getCategories().then(res => {
        if (res.status === ERR_OK) {
          this.categories = this.normalizeCateries(res.data.tags)
          this.categories.forEach(item => {
            this.offset[item.name] = 0
          })
          this._getPlayListByCat()
        }
      })
    },
    _getPlayListByCat() {
      playListApi.getPlayListByCat(this.cat, this.offset[this.cat]).then(res => {
        if (res.status === ERR_OK) {
          res.data.playlists.forEach(item => {
            this.playLists.push(item)
          })
          this.addMore = false
          this.needLoad = true
          this.offset[this.cat] += 21
        }
      })
    },
    handleLoadImg() {
      this.$refs.scroll.refresh()
    },
    loadMore() {
      this.addMore = true
      if (this.needLoad) {
        this.needLoad = false
        this._getPlayListByCat()
      }
      this.$refs.scroll.refresh()
    },
    categoryChange(name) {
      this.cat = name
    },
    handleBack() {
      this.$router.back()
    },
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.content.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    normalizeCateries(arr) {
      let result = []
      arr.forEach(item => {
        result.push({ id: item.id, name: item.name })
      })
      return result
    }
  },
  watch: {
    cat: function() {
      this.playLists = []
      for (let k in this.offset) {
        this.offset[k] = 0
      }
      this.loadMore()
    }
  },
  created() {
    this._getCategories()
  }
}
</script>

<style lang="scss" scoped>
.play-list {
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
    height: 44px;
    line-height: 44px;
    .item-active {
      position: relative;
      color: #ffcd32;
      &::after {
        content: ' ';
        position: absolute;
        width: 15px;
        height: 2px;
        background-color: #ffcd32;
        bottom: 5px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .scroll-wrapper {
    overflow: hidden;
    height: calc(100% - 100px);
  }
}
</style>