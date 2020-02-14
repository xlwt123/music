<template>
  <div class="song-list">
    <ul class="pl-1 m-0">
      <li v-for="(song, index) of list" :key="song.id" class="list-content pb-3 d-flex" @click="selectSong(song, index)">
        <div class="rank text-center">{{index + 1}}</div>
        <div class="song-info flex-1 pl-2">
          <h1 class="song-name fs-xm m-0 w-100 text-ellipsis">{{song.name}}</h1>
          <span class="song-detail fs-s text-ellipsis w-100 text-text-l pt-1">{{artistsList(song.artists)}} - {{song.album.name}}</span>
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
    artistsList(arr) {
      let result = []
      arr.forEach(item => {
        result.push(item.name)
      })
      return result.join('/')
    },
    selectSong(song, index) {
      this.$emit('select', song, index)
    }
  },
}
</script>

<style lang="scss" scoped>
.list-content {
  list-style: none;
  h1 {
    font-weight: 400
  }
  .rank {
    width: 30px;
    line-height: 20px;
  }
  .song-info {
    width: calc(100% - 30px)
  }
}
</style>