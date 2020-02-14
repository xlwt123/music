<template>
  <transition name=slide>
    <div class="comment">
      <div class="header d-flex">
        <div class="back text-center" @click="back">
          <i class="iconfont icon-back"></i>
        </div>
        <h1 class="title m-0 fs-xm flex-1 pl-2">评论 ({{total}})</h1>
      </div>
      <scroll class="comments-wrapper px-3 w-100" :pullup="true" @scrollToEnd="loadMoreComment" ref="scroll">
        <div class="">
          <comments :hotComments="hotComments" :comments="comments"></comments>
          <loading v-show="addMore" title="" ref="loading" class="pt-2"></loading>
          <no-result title="加载完毕" v-show="!addMore" class="pt-2"></no-result>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
import Comments from '@/components/Comments'
import Scroll from '@/components/Scroll'
import Loading from '@/components/Loading'
import NoResult from '@/components/NoResult'
import { ERR_OK } from "../api/config"
import commentApi from '../api/comment'

export default {
  props: {
    id: {
      type: String
    },
    type: {
      type: String
    }
  },
  components: {
    Comments,
    Scroll,
    Loading,
    NoResult
  },
  data() {
    return {
      hotComments: [],
      comments: [],
      before: 0,
      total: 0,
      addMore: false,
    }
  },
  methods: {
    _getComments() {
      commentApi.getComments(this.type, this.id, this.before).then(res => {
        if (res.status === ERR_OK) {
          this.total = res.data.total
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
        this._getComments()
      }
      this.$refs.scroll.refresh()
    },
    back() {
      this.$router.back()
    }
  },
  watch: {
    id: function() {
      this.before = 0
      this.hotComments = []
      this.comments = []
      this.total = 0
      this._getComments()
      this.$refs.scroll.scrollTo(0, 0, 0)
    }
  },
  created() {
    this._getComments()
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
.comment {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 200;
  background: #222;
  .header {
    height: 44px;
    line-height: 44px;
    .back {
      width: 40px;
    }
    .title {
      font-weight: 400;
    }
  }
  .comments-wrapper {
    overflow: hidden;
    height: calc(100% - 44px);
  }
}
</style>