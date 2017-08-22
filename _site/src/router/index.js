import Vue from 'vue'
import Router from 'vue-router'
import recommend from '../components/recommend/recommend'
import singer from '../components/singer/singer'
import ranking from '../components/ranking/ranking'
import hunt from '../components/hunt/hunt'
import singerdetail from '../components/singer/singerdetail'
import recommenddetail from '../components/recommend/recommenddetail'
import rankingdetail from '../components/ranking/rankdetail'
Vue.use(Router)

export default new Router({
routes: [
    {
      path: '/',
      name: '/',
      component: recommend
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: recommend,
      children:[{
        path:":id" ,
        component: recommenddetail
      }]
    },
    {
      path: '/singer',
      name: 'singer',
      component: singer,
      children:[{
        path:":id" ,
        component: singerdetail
      }]             
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: ranking,
      children:[{
        path:":id" ,
        component: rankingdetail
      }]
    },
    {
      path: '/hunt',
      name: 'hunt',
      component: hunt,
      children:[{
        path:":id" ,
        component: singerdetail
      }]  
    }
]
})
