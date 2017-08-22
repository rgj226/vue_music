<template>
  <scroll ref="scroll" :data="result" class="hubtlist" :pullup="pullup" @scrollToEnd="searchmore">
    <ul>
      <li v-for="item in result" @click="selectitem(item)">
        <span class="icon" :class="geticon(item)"></span>
        <span class="name">
         {{gettext(item)}}
        </span>
      </li>
      <loading v-show="hasmore" title=""></loading>
    </ul> 
  </scroll>
</template>

<script type="text/ecmascript-6">  
  import scroll from '../../base/scroll/scroll'
  import loading from '../../base/loading/loading'
  import Singer from '../../common/js/singer'
  import {mapMutations} from 'vuex'
  export default {
    data(){
      return{
        result:[],
        pullup:true,  //scroll组件下拉刷新
        hasmore:true,
        page:1,
        newqu:''
      }
    },
    props:{
      query:{
        type:String,
        dufault:''
      }
    },
    methods:{
      searchmore(){  //上拉加载
        if(!this.hasmore){
          return
        }
        this.page++
        this.$http.get('/api/gethunt' ,{params: {
          g_tk:5381,
          uin:0,
          format:'json',
          inCharset:'utf-8',
          outCharset:'utf-8',
          notice:0,
          platform:'h5',
          needNewCode:1,
          w:this.newqu,  //搜索关键字
          zhidaqu:1,
          catZhida:1,
          t:0,
          flag:1,
          ie:'utf-8',
          sem:1,
          aggr:0,
          perpage:20,
          n:20,
          p:this.page,   //显示第几页的数据
          remoteplace:'txt.mqq.all',
          _:1502949198834   
        }}).then(response => {
          response=response.body; 
          //因为每次下拉要加载更多，每次的数据要拼接在上一次的数据下
          this.result=this.result.concat(this._normalizeSongs(this._getResult(response.data))) 
          //console.log(this.result)   
          //下拉刷新判断。刷新加载后判断是否还有更多
          this.checkmore(response.data)
        })
      },
      huntmethods(newquery){
        this.hasmore=true  //加载标识
        this.page=1
        this.$refs.scroll.scrollTo(0,0)
        this.$http.get('/api/gethunt' ,{params: {
          g_tk:5381,
          uin:0,
          format:'json',
          inCharset:'utf-8',
          outCharset:'utf-8',
          notice:0,
          platform:'h5',
          needNewCode:1,
          w:newquery,
          zhidaqu:1,
          catZhida:1,
          t:0,
          flag:1,
          ie:'utf-8',
          sem:1,
          aggr:0,
          perpage:20,
          n:20,
          p:this.page,
          remoteplace:'txt.mqq.all',
          _:1502949198834   
        }}).then(response => {
          response=response.body; 
          this.result=this._normalizeSongs(this._getResult(response.data)) 
          console.log(this.result)   
          //下拉刷新判断。刷新加载后判断是否还有更多
          this.checkmore(response.data)
        })  
      },
      _getResult(data){  //数据整理
        let ret=[]
        if(data.zhida&&data.zhida.singerid){
          ret.push({...data.zhida,...{type:'singer'}})
        }
        if(data.song){
          ret=ret.concat(data.song.list)
        }
        //console.log(ret)
        return ret
      },
       _normalizeSongs(list) {  //遍历数据，找出需要的，组成新对象
        let ret = []
        list.forEach((item) => {          
          if ((item.songid && item.albummid)||(item.singerid&&item.singermid)) {
            ret.push(this.createSong(item))
          }
        })
        return ret
      },
      createSong(musicData) {  //将需要的数据组成一个新的对象
        let Song={}
        return Song=({
          type:musicData.type,
          singerid:musicData.singerid,
          singermid:musicData.singermid,
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
      },
      geticon(item){    //判断是分手还是歌名，显示不同的icon
        if(item.type==='singer'){
          return 'singericon'
        }else{
          return 'musicicon'
        }
      },
      gettext(item){  //判断是分手还是歌名，显示对应的文本
         if(item.type==='singer'){
           return this.query
         }else{
           return `${item.name}-${item.singer}`
         }
      },
      checkmore(data){   //判断下拉加载后是否还有更多可加载
        const song=data.song
        if(!song.list.length||(song.curnum+song.curpage*20)>song.totalnum){
          this.hasmore=false
        }
      },
      selectitem(item){
        //console.log(item)
        if(item.type==='singer'){
          const singer = new Singer({
            id:item.singermid,
            name:this.newqu
          })     
          this.$router.push({
             path:`/hunt/${item.singermid}`
          })  
          this.setsinger(singer) 
        }                        
      },
      ...mapMutations({
        setsinger:'SET_SINGER'
      })
    },
    watch:{
      query(newquery){
        this.newqu=newquery        
        this.huntmethods(newquery)
      }
    },
    components:{
      scroll,
      loading
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .hubtlist{
    height: 100%;
    overflow: hidden;
    padding: 0 40px;
    background: #222;
    li{
      display: flex;
      overflow: hidden;
      color: rgba(255,255,255,0.3);
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      margin-bottom: 40px;
      .icon{
        display: inline-block;
        width: 40px;
        height:40px;
        margin-right: 20px;
        &.singericon{
          background: url(user.png) no-repeat;
          background-size: cover;
        }
        &.musicicon{
          background: url(music.png) no-repeat;
          background-size: cover;
        }
      }
    }
  }
</style>