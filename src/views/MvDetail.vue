<template>
  <transition name="slide">
    <div class="mv-detail w-100">
      <div class="back text-center fs-xm" @click="handleBack">
        <i class="iconfont icon-back"></i>
      </div>
      <video :src="mvDetail.url" class="w-100" controls ref="video"></video>
      <div class="mv-recommend px-3 pt-3 w-100" ref="recommend">
        <scroll class="recommend-wrapper h-100" :data="similarMv" ref="scroll" :pullup="true" @scrollToEnd="loadMoreComment"> 
          <div class="recommend-content">
            <div class="mv-info d-flex flex-wrap jc-between">
              <div class="mv-title fs-xl pb-3 w-100">{{mvDetail.name}}</div>
              <span class="playCount fs-m text-text-l">{{normalizePlayCount(mvDetail.playCount)}}次观看</span>
              <span class="publishTime fs-m text-text-l">{{mvDetail.publishTime}}</span>
              <div class="mv-desc w-100 text-text-l pt-3 fs-m">{{mvDetail.desc}}</div>
            </div>
            <div class="similar-mv pt-5">
              <div class="title fs-m pb-2">相关MV</div>
              <div class="mv-item py-2 d-flex" v-for="mv of similarMv" :key="mv.id" @click="toMvDetail(mv.id)">
                <img :src="mv.cover" :alt="mv.name" width="150" class="mv-cover">
                <div class="mv-message w-100 px-2 pt-2 flex-1">
                  <div class="name fs-m text-ellipsis w-100">{{mv.name}}</div>
                  <div class="count fs-s pt-3 text-text-l">{{normalizePlayCount(mv.playCount)}}次观看</div>
                  <div class="time fs-s pt-3 text-text-l">{{format(mv.duration/1000)}}</div>
                </div>
              </div>
            </div>
            <div class="mv-commend pt-3">
              <comments :hotComments="hotComments" :comments="comments"></comments>
              <loading v-show="addMore" title="" ref="loading"></loading>
              <no-result title="加载完毕" v-show="!addMore"></no-result>
            </div>
          </div>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script>
import Scroll from '@/components/Scroll'
import Loading from '@/components/Loading'
import Comments from '@/components/Comments'
import NoResult from '@/components/NoResult'
import { ERR_OK } from "../api/config"
import commentApi from '../api/comment'
import mvApi from "../api/mv"
import { format } from "../assets/js/util"
import { playListMixin } from '../assets/js/mixin'

export default {
  mixins: [playListMixin],
  components: {
    Scroll,
    Comments,
    Loading,
    NoResult
  },
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      mvDetail: {},
      similarMv: [],
      before: 0,
      hotComments: [],
      comments: [],
      addMore: false,
    }
  },
  methods: {
    _getMvDetail() {
      mvApi.getMvdetail(this.id).then(res => {
        if (res.status === ERR_OK) {
          this.mvDetail = res.data.data
        }
      })
    },
    _getMvUrl() {
      mvApi.getMvUrl(this.id).then(res => {
        if (res.status === ERR_OK) {
          this.$set(this.mvDetail, 'url', res.data.data.url)
        }
      })
    },
    _getSimilarMv() {
      mvApi.getSimilarMv(this.id).then(res => {
        if (res.status === ERR_OK ) {
          this.similarMv = res.data.mvs
        }
      })
    },
    _getMvComments() {
      commentApi.getMvComments(this.id, this.before).then(res => {
        if (res.status === ERR_OK) {
          if (res.data.hotComments) {
            this.hotComments = res.data.hotComments
          }
          this.comments = this.comments.concat(res.data.comments)
          if (res.data.more) {
            this.before = res.data.comments[res.data.comments.length - 1].time
            this.addMore = true
          }
        }
      })
    },
    loadMoreComment() {
      if (this.addMore) {
        this.addMore = false
        this._getMvComments()
      }
      this.$refs.scroll.refresh()
    },
    handleBack() {
      this.$router.back()
    },
    toMvDetail(id) {
      this.$router.push(`/mvdetail/${id}`)
    },
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
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
  watch: {
    id: function() {
      this.mvDetail = {}
      this.before = 0
      this.hotComments = []
      this.comments = []
      this._getMvDetail()
      this._getMvUrl()
      this._getSimilarMv()
      this._getMvComments()
      this.$refs.scroll.scrollTo(0, 0, 0)
    }
  },
  created() {
    this._getMvDetail()
    this._getMvUrl()
    this._getSimilarMv()
    this._getMvComments()
    this.format = format
  },
}
</script>

<style lang="scss" scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}
.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}

.mv-detail {
  position: fixed;
  top: 0;
  z-index: 10;
  background: #222;
  .back {
    display: inline-block;
    width: 10%;
    position: absolute;
    z-index: 10;
    line-height: 40px;
  }
  video {
    object-fit: fill;
    height: 231px;
  }
  .mv-recommend {
    position: fixed;
    bottom: 0;
    top: 231px;
    left: 0;
    .recommend-wrapper {
      overflow: hidden;
      .recommend-content {
        .mv-info {
          .mv-desc {
            line-height: 1.5;
          }
        }
        .similar-mv {
          .mv-cover {
            border-radius: 5px;
          }
          .mv-message {
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>