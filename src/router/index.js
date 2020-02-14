import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from '../views/Recommend.vue'
import Mv from '../views/Mv.vue'
import Rank from '../views/Rank.vue'
import Search from '../views/Search.vue'
import PlayList from '../views/PlayList.vue'
import PlayListDetail from '../views/PlayListDetail.vue'
import MvDetail from '../views/MvDetail.vue'
import Comment from '../views/Comment.vue'
import User from '../views/User.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'recommend'
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: Recommend
  },
  {
    path: '/mv',
    name: 'mv',
    component: Mv
  },
  {
    path: '/rank',
    name: 'rank',
    component: Rank
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  {
    path: '/playlist',
    name: 'playlist',
    component: PlayList
  },
  {
    path: '/playlist/:id',
    name: 'playListDetail',
    component: PlayListDetail,
    props: true
  },
  {
    path: '/mvdetail/:id',
    name: 'mvDetail',
    component: MvDetail,
    props: true
  },
  {
    path: '/comment/:type/:id',
    name: 'comment',
    component: Comment,
    props: true
  }, 
  {
    path: '/user',
    name: 'user',
    component: User
  }
]

const router = new VueRouter({
  routes
})

export default router
