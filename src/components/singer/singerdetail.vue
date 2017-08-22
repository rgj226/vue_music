<template>
  <transition name="slider">
    <song :songs='songlist' :title='title' :bgimage='bgimage'> </song>  
  </transition>
  
</template>

<script type="text/ecmascript-6">  
  import {mapGetters} from 'vuex'
  import song from '../song/song'
  export default {
    data(){
      return {
        songlist:[]
      }
    },
    computed:{
      ...mapGetters([
        'singer'
      ]),
      title(){
        return this.singer.name
      },
      bgimage(){
        return this.singer.avatar
      }      
    },
    created(){
      console.log(this.singer)
      if(!this.singer.id){   //判断是否是从父组件点击过来的。如果不是回到父组件。
        this.$router.push('/singer')  //实际是阻止当前页面刷新后获取不到singer.id
        return
      }
      var url='https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
      this.$http.get('https://bird.ioliu.cn/v1/?url='+url ,{params: {
        g_tk:940235217,
        loginUin:0,
        hostUin:0,
        format:'json',
        inCharset:'utf8',
        outCharset:'utf-8',
        notice:0,
        platform:'yqq',
        needNewCode:0,
        singermid:this.singer.id,
        order:'listen',
        begin:0,
        num:50,
        songstatus:1
      }}).then(response => {
        response=response.body;  
        //this.songs = this._normalizeSongs(res.data.list)
        this.songlist=this._normalizeSongs(response.data.list)  //只取出需要的数据
        //console.log(response.data.list)
        console.log(this.songlist)
      })
    },
    methods:{
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item    //{musicData}就是源数据中的response.data.list.musicData
          if (musicData.songid && musicData.albummid) {
            ret.push(this.createSong(musicData))
          }
        })
        return ret
      },
      createSong(musicData) {  //将需要的数据组成一个新的对象
        let Song={}
        return Song=({
          id: musicData.songid,
          mid: musicData.songmid,
          singer: this.filterSinger(musicData.singer),  //同一首歌肯能会有两个歌手合唱，做处理
          name: musicData.songname,
          album: musicData.albumname,
          duration: musicData.interval,
          image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
          url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
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
      song
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  
  .slider-enter-active,.slider-leave-actiov{
    transition: all 0.3s;
  }
  .slider-enter,.slider-leave-to{
    transform: translate3d(100%,0,0);
  }
</style>