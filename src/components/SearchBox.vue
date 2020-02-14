<template>
  <div class="search-box d-flex ai-center mx-3 px-2 bg-bg-h">
    <i class="iconfont icon-search text-bg"></i>
    <input ref="query" v-model="query" class="box flex-1 bg-bg-h text-text fs-m px-3" :placeholder="placeholder"/>
    <i @click="clear" v-show="query" class="iconfont icon-dismiss text-bg fs-xm"></i>
  </div>
</template>

<script>
import { throttle } from '../assets/js/util'

export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    clear() {
      this.query = ''
    },
    inputBlur() {
      this.$refs.query.blur()
    }
  },
  created() {
    this.$watch('query', throttle((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  height: 40px;
  border-radius: 5px;
  .box {
    border: none;
    height: 40px;
    outline: none;
  }
}
</style>
