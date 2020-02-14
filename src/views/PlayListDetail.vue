<template>
  <transition class="play-list-detail" name="slide">
    <music-list :detail="playListDetail" :songs="songs" :id="id"></music-list>
  </transition>
</template>

<script>
import MusicList from '@/components/MusicList'
import playListApi from '../api/playList'
import songApi from '../api/song'
import { ERR_OK } from "../api/config"
export default {
  components: {
    MusicList
  },
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      playListDetail: {},
      songs: [],
      songsId: ''
    }
  },
  methods: {
    _getPlayListDetail() {
      this.playListDetail = {}
      this.songs = []
      playListApi.getPlayListDetail(this.id).then(res => {
        if (res.status === ERR_OK) {
          this.playListDetail = this.normalizeDetail(res.data.playlist)
          this.songs = this.normalizeSongs(res.data.playlist.tracks)
          this.songsId = this.normalizeSongsId(res.data.playlist.tracks)
          this._getSongsUrl()
        }
      })
    },
    _getSongsUrl() {
      songApi.getSongUrl(this.songsId).then(res => {
        if (res.status === ERR_OK) {
          let data = res.data.data
          for (let i = 0; i < this.songs.length; i++) {
            for (let j = 0; j < data.length; j++) {
              if (this.songs[i].id === data[j].id) {
                this.songs[i].url = data[j].url
                this.songs[i].size = data[j].size
              }
            }
          }
        }
      })
    },
    normalizeDetail(obj) {
      let result = {}
      result.name = obj.name
      result.description = obj.description
      result.coverImgUrl = obj.coverImgUrl
      result.creator = obj.creator
      result.id = obj.id
      result.playCount = obj.playCount
      result.subscribedCount = obj.subscribedCount
      return result
    },
    normalizeSongs(arr) {
      let result = []
      arr.forEach(item => {
        result.push({ album: item.al, artists: item.ar, name: item.name, id: item.id })
      })
      return result
    },
    normalizeSongsId(arr) {
      let result = [];
      arr.forEach(item => {
        result.push(item.id)
      })
      result.join(',')
      return result
    }
  },
  watch: {
    id: function() {
      this._getPlayListDetail()
    }
  },
  created() {
    this._getPlayListDetail()
  }
}
</script>

<style lang="scss" scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}
.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>