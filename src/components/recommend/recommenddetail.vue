<template>
  <transition name='detail'>
   <recommendlist :songs='songs' :titlt="titlt" :bgimage="bgimage"></recommendlist>
  </transition>
</template>

<script type="text/ecmascript-6">  
  import {mapGetters} from 'vuex'
  import recommendlist from './recommendlist'
  export default {
    data(){
      return{
        songs:[]
      }
    },
    computed:{
      titlt(){
        return this.disc.dissname
      },
      bgimage(){
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    created(){  
      if(!this.disc.dissid){
        this.$router.push('/recommend')  //实际是阻止当前页面刷新后获取不到singer.id
        return
      }
      var url='https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
      this.$http.get('https://bird.ioliu.cn/v1/?url='+url ,{params: {
        type:1,
        json:1,
        utf8:1,
        onlysong:0,
        disstid:this.disc.dissid,
        format:'json',
        g_tk:88854890,
        loginUin:583181142,
        hostUin:0,
        inCharset:'utf8',
        outCharset:'utf-8',
        notice:0,
        platform:'yqq',
        needNewCode:0
      }}).then(response => {
        response=response.body;    
        console.log(response.cdlist[0].songlist)
        this.songs= this. _normalizeSongs(response.cdlist[0].songlist)
        console.log(this.songs)      
      })  
    },
    methods:{
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          //let {musicData} = item    //{musicData}就是源数据中的response.data.list.musicData
          if (item.songid && item.albummid) {
            ret.push(this.createSong(item))
          }
        })
        return ret
      },
      createSong(item) {  //将需要的数据组成一个新的对象
        let Song={}
        return Song=({
          id: item.songid,
          mid: item.songmid,
          singer: this.filterSinger(item.singer),  //同一首歌肯能会有两个歌手合唱，做处理
          name: item.songname,
          album: item.albumname,
          duration: item.interval,
          image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.albummid}.jpg?max_age=2592000`,
          url: `http://ws.stream.qqmusic.qq.com/${item.songid}.m4a?fromtag=46`
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
     recommendlist
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .detail{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #222;
  }
  .detail-enter-active,.slider-leave-actiov{
    transition: all 0.3s;
  }
  .detail-enter,.slider-leave-to{
    transform: translate3d(100%,0,0);
  }
</style>