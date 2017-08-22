<template>
  <transition name='detail'>
    <rankinglist :songs="songs" :title="titlt" :bgimage="bgimage"> </rankinglist>
  </transition>
</template>

<script type="text/ecmascript-6">  
  import rankinglist from "./rankinglist"
  import {mapGetters} from 'vuex'
  export default {
    data(){
      return{
        songs:[]
      }
    },
    computed:{
      titlt(){
       return this.ranking.topTitle
      },
      bgimage(){
        return this.ranking.picUrl
      },
      ...mapGetters([
        'ranking'
      ])
    },
    created(){
      if(!this.ranking.id){
        this.$router.push('/ranking')  //实际是阻止当前页面刷新后获取不到singer.id
        return
      }
      var url='https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
      this.$http.get('https://bird.ioliu.cn/v1/?url='+url ,{params: {
        g_tk:5381,
        uin:0,
        format:'json',
        inCharset:'utf-8',
        outCharset:'utf-8',
        notice:0,
        platform:'h5',
        needNewCode:1,
        tpl:3,
        page:'detail',
        type:'top',
        topid:this.ranking.id,
        _:1502787499442
      }}).then(response => {
        response=response.body;    
        //console.log(response)
        this.songs= this._normalizeSongs(response.songlist)
        console.log(this.songs)      
      })
    },
    methods:{
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          //let {musicData} = item    //{musicData}就是源数据中的response.data.list.musicData
          if (item.data.songid && item.data.albummid) {
            ret.push(this.createSong(item))
          }
        })
        return ret
      },
      createSong(item) {  //将需要的数据组成一个新的对象
        let Song={}
        return Song=({
          id: item.data.songid,
          mid: item.data.songmid,
          singer: this.filterSinger(item.data.singer),  //同一首歌肯能会有两个歌手合唱，做处理
          name: item.data.songname,
          album: item.data.albumname,
          duration: item.data.interval,
          image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.data.albummid}.jpg?max_age=2592000`,
          url: `http://ws.stream.qqmusic.qq.com/${item.data.songid}.m4a?fromtag=46`
        })
      },
      filterSinger(singer) {
        let ret = []
        if (!singer) {
          return ''
        }
        singer.forEach((s) => {   //遍历所有的歌手信息，然后用/分割成字符
          ret.push(s.name)
        })
        return ret.join('/')
      }   
    },
    components:{
      rankinglist
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .detail-enter-active,.slider-leave-actiov{
    transition: all 0.3s;
  }
  .detail-enter,.slider-leave-to{
    transform: translate3d(100%,0,0);
  }
</style>