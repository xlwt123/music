<template>
  <div class="comments">
    <div class="hot-comments pt-3 pb-3" v-if="hotComments.length>0">
      <div class="title fs-m">热门评论</div>
      <div class="pt-4 comment-content d-flex" v-for="comment of hotComments" :key="comment.commentId">
        <img :src="comment.user.avatarUrl" width="35" height="35" class="comment-user-avatar">
        <div class="comment-detail pl-3 flex-1">
          <div class="detail-top pt-1 d-flex">
            <div class="time-nickname flex-1">
              <p class="nickname m-0 fs-s pb-1">{{comment.user.nickname}}</p>
              <p class="time m-0 fs-xs pb-2 text-text-l">{{normalizeTime(comment.time)}}</p>
            </div>
            <div class="likes fs-s text-text-l">
              <span>{{comment.likedCount}}</span>
              <i class="iconfont icon-not-favorite fs-s pl-1"></i>
            </div>
          </div>
          <div class="detail-desc fs-m">
            <div class="be-replied bg-bg-h p-2 mb-2 text-text-ll" v-if="comment.beReplied.length>0">
              <span class="text-text-l">回复 </span>{{comment.beReplied[0].user.nickname}}<span class="text-text-l"> :</span>
              {{comment.beReplied[0].content}}
            </div>
            <div class="content">
              {{comment.content}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="all-comments pt-3">
      <div class="title fs-m">所有评论</div>
      <div class="pt-4 comment-content d-flex" v-for="comment of comments" :key="comment.commentId">
        <img :src="comment.user.avatarUrl" width="35" height="35" class="comment-user-avatar">
        <div class="comment-detail pl-3 flex-1">
          <div class="detail-top pt-1 d-flex">
            <div class="time-nickname flex-1">
              <p class="nickname m-0 fs-s pb-1">{{comment.user.nickname}}</p>
              <p class="time m-0 fs-xs pb-2 text-text-l">{{normalizeTime(comment.time)}}</p>
            </div>
            <div class="likes fs-s text-text-l">
              <span>{{comment.likedCount}}</span>
              <i class="iconfont icon-not-favorite fs-s pl-1"></i>
            </div>
          </div>
          <div class="detail-desc fs-m">
            <div class="be-replied bg-bg-h p-2 mb-2 text-text-ll" v-if="comment.beReplied.length>0">
              <span class="text-text-l">回复 </span>{{comment.beReplied[0].user.nickname}}<span class="text-text-l"> :</span>
              {{comment.beReplied[0].content}}
            </div>
            <div class="content">
              {{comment.content}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hotComments: {
      type: Array
    },
    comments: {
      type: Array
    }
  },
  methods: {
    normalizeTime(time) {
      let date = new Date(time)
      let now = new Date()
      let year = date.getFullYear()
      let mon = date.getMonth() + 1
      let day = date.getDate()
      if (year === now.getFullYear()) {
        return `${mon}月${day}日`
      } else {
        return `${year}年${mon}月${day}日`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comments {
  .comment-content {
    .comment-user-avatar {
      border-radius: 50%
    }
    .detail-desc {
      line-height: 1.5
    }
  }
}
</style>