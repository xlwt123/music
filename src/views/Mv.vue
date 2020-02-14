<template>
  <div class="mv w-100" ref="mv">
    <scroll class="mv-scroll h-100" :data="mvList" ref="scroll" :pullup="true" @scrollToEnd="loadMore">
      <div class="mv-list">
        <div class="mv-item" v-for="item of mvList" :key="item.id" @click="toMvDetail(item.id)">
          <div class="mv-cover w-100">
            <img v-lazy="item.cover" alt="item.name" class="w-100" @load="handleLoadImg">
            <div class="time fs-s d-flex ai-center">
              <i class="iconfont icon-play-1 pr-2 text-text fs-s"></i>
              <span>{{format(item.duration/1000)}}</span>
            </div>
          </div>
          <div class="mv-info">
            <p class="mv-name fs-m m-0 px-2 py-3">{{item.name}}</p>
          </div>
        </div>
        <loading v-show="addMore" title="" ref="loading"></loading>
        <no-result title="加载完毕" v-show="!addMore"></no-result>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/components/Scroll'
import Loading from '@/components/Loading'
import NoResult from '@/components/NoResult'
import { ERR_OK } from "../api/config"
import mvApi from "../api/mv"
import { format } from "../assets/js/util"
import { playListMixin } from '../assets/js/mixin'


export default {
  mixins: [playListMixin],
  components: {
    Scroll,
    Loading,
    NoResult
  },
  data() {
    return {
      mvList: [],
      offset: 0,
      addMore: false,
    }
  },
  methods: {
    _getMvList() {
      mvApi.getMvList(this.offset).then(res => {
        if (res.status === ERR_OK) {
          this.mvList = this.mvList.concat(res.data.data)
          this.offset += 10
          if (res.data.hasMore) {
            this.addMore = true
          }
        }
      })
    },
    toMvDetail(id) {
      this.$router.push(`/mvdetail/${id}`)
    },
    handleLoadImg() {
      this.$refs.scroll.refresh()
    },
    loadMore() {
      if (this.addMore) {
        this.addMore = false
        this._getMvList()
      }
      this.$refs.scroll.refresh()
    },
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.mv.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
  },
  created() {
    this._getMvList()
    this.format = format
  }
}
</script>

<style lang="scss" scoped>
.mv {
  position: fixed;
  top: 92px;
  bottom: 0;
  left: 0;
  .mv-scroll {
    overflow: hidden;
    .mv-item {
      .mv-cover {
        position: relative;
        .time {
          position: absolute;
          bottom: 15px;
          left: 10px;
        }
      }
    }
    
  }
}

</style>