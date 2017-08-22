<template>
  <div class="singer" ref="singer">
    <singerlist @select="singerselect" :data="singers" ref="list"></singerlist>      
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">  
  import singerlist from "./singerlist"
  import {mapMutations} from 'vuex'
  import {playmixin} from '../../common/js/mixin.js'
  const HOT_NAME = '热门'
  export default { 
    mixins: [playmixin],
    data(){
      return {
        singers:[]
      }
    },
    created(){  
      var url='https://c.y.qq.com/v8/fcg-bin/v8.fcg'
      this.$http.get('https://bird.ioliu.cn/v1/?url='+url ,{params: {
        channel:'singer',
        page:'list',
        key:"all_all_all",
        pagesize:100,
        pagenum:1,
        g_tk:940235217,
        loginUin:0,
        hostUin:0,
        format:"json",
        inCharset:"utf-8",
        outCharset:'utf-8',
        notice:0,
        platform:'yqq',
        needNewCode:0
      }}).then(response => {
        response=response.body;    
       // console.log(response)
        this.singers= this.singerclassify(response.data.list)
        console.log(this.singers)      
      })  
    },
    methods:{
      //歌手分类:思路，数据要分为热门数据以及排列数据。
      singerclassify(list){  //遍历歌手数据.产生新对象
        let map={       
          hot:{         //定义一个热门歌手数据对象
            title:HOT_NAME,
            items:[]   //数据由list遍历后填充
          }
        }
        list.forEach((item,index)=>{  //遍历list  item in list  
          if(index<10){               //取list的前10条为热门歌手
            map.hot.items.push({
              name: item.Fsinger_name,
              id: item.Fsinger_mid,
              avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
            })
          } 
//        根据 Findex 歌手聚类,创建一个新对象
          const key=item.Findex
          if(!map[key]){  //添加key对象,用来聚类
            map[key]={
              title:key,
              items:[]
            }
          }
          map[key].items.push({
            name: item.Fsinger_name,
            id: item.Fsinger_mid,
            avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`                       
          })
        })
        //console.log(map)
        //将map转为有序列表
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {  //将title a-z的聚类，然后排序
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)    //返回新数组
      },
      singerselect(singer){
        //console.log(singer)
        this.$router.push({
          path:`/singer/${singer.id}`
        })
        this.setsinger(singer)
      },
       handplaylist(playlist){
        const bottom = playlist.length>0?'125px':''
        this.$refs.singer.style.bottom=bottom
        this.$refs.list.refresh()
      },
      ...mapMutations({
        setsinger:'SET_SINGER'
      })
    },
    components:{
      singerlist      
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .singer{
    position: absolute;
    top: 176px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
  }
</style>