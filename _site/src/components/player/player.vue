<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal">
      <div class="normal-player" v-show="fullscreen">
        <div class="bgimg">                                            
          <img :src="currentsong.image"  alt="" />
        </div>
        <div class="top">
          <span @click="close" class="close">收起</span>
          <h1 class="title" v-html="currentsong.name"></h1>
          <p class="singername" v-html="currentsong.singer"></p>        
        </div>
        <div class="cdwrap">
          <div  :class="imgrotate">
            <img :src="currentsong.image" alt="" />
          </div>
        </div>
        <div class="bottom">
       <!-- 歌曲进度条-->
          <div class="bar-inner">
            <span class="nowtime">{{timelint(currentTime)}}</span>
            <div class="linebar" ref='linebar' @click="changetime">
              <div class="bgyellow" ref="bgyellow"></div>              
              <div class="iconyellow" ref="iconyellow" @touchstart='touchstart' @touchmove="touchmove" @touchend="touchend"></div>
            </div>
            <span class="time">{{timelint(currentsong.duration)}}</span>
          </div>
         <!-- 控制按钮-->
          <div class="operators">
            <div class="icon i-left"><i :class="looppattern" @click="pattern"></i></div>
            <div class="icon i-left"><i @click="previous" class="icon-shangyishou"></i></div>
            <div class="icon i-center"><i @click="playmusic" :class="iconplay"></i></div>
            <div class="icon i-right"><i @click="next" class="icon-xiayishou"></i></div>
            <div class="icon i-right"><i class="icon-like"></i></div>
          </div>
        </div>
      </div>
    </transition>
    
    <transition name="min">
      <div @click="open" class="min-player" v-show="!fullscreen">
        <div class="mincdimg" :class="imgrotate">
          <img :src="currentsong.image" alt="" />
        </div>
        <div class="content">
          <p class="songname" v-html="currentsong.name"></p>
          <p class="name" v-html="currentsong.singer"></p>
        </div>
        <div class="control play">
          <span @click.stop="playmusic" :class="iconplay" class="controlicon"></span>
        </div>
        <div class="control listwrap">
          <span class="controlicon icon-list"></span>
        </div>
      </div>
    </transition> 
    <!--audio canplay缓冲至目前可播放状态 timeupdate 当前播放时间发生改变的时候-->
    <audio ref="audio" :src="currentsong.url" @canplay='songreday' @timeupdate="timeupdate" @ended='ended'></audio>
  </div>
</template>

<script type="text/ecmascript-6">  
  import {mapGetters,mapMutations} from 'vuex'
  import {playmode} from '../../common/js/palyconfig'
  export default {
    data(){
      return{
        nextreday:false,
        currentTime:0
      }
    },
    computed:{
      imgrotate(){  //点击更换按钮样式
        return this.playing ? 'cdimg imgrotate' : 'cdimg stop imgrotate'
      },
      looppattern(){
        return this.mode===playmode.sequence? 'icon-loop' :this.mode===playmode.loop?'icon-onlyloop':'icon-random'
      },
      iconplay(){
        return this.playing ? 'icon-play' : 'icon-zanting'
      },
      ...mapGetters([
        'fullscreen',       //是否展开状态
        'playlist',        //歌曲列表
        'playing',        //是否播放状态
        'currentindex',  //当前播放歌曲
        'mode',         //当前播放模式
        'currentsong', //getter计算获取当前播放歌曲
        'sequencelist'//播放模式对应播放列表
      ])
    },
    methods:{
      close(){
        this.setFullScreen(false)
      },
      open(){
        this.setFullScreen(true)
      },
      playmusic(){
       this.setplayingstate(!this.playing)    //点击播放按钮更改播放状态。watch  playing去执行play()播放
      },
      pattern(){   //循环状态.思路：循环状态变更的时候，歌曲的列表变更。且要当前歌曲id不变
        const patternnum=(this.mode+1)%3
        this.modestate(patternnum)  //提交播放状态。=》更改播放列表
        let list =null
        //console.log(this.currentindex)
        if(patternnum===playmode.random){
          list=this.shuffle(this.sequencelist)
        }else{
          list = this.sequencelist
        }
        this.setplaylist(list)
      },
      getrandomint(min,max){
        return Math.floor(Math.random()*(max-min+1)+min)
      },
      shuffle(arr){    //将歌曲数据随机打乱
        let _arr=arr.slice()   //该方法并不会修改数组，而是返回一个子数组.解决洗牌过程中改变原本播放列表
        for(let i=0;i<_arr.length;i++){         
          let j=this.getrandomint(0,i)
          let t=_arr[i]
          _arr[i]=_arr[j]
          _arr[j]=t
        }
        return _arr
      },
      next(){
        if(!this.nextreday){   //解决点击速度过快的报错，只有在为true， audio canplay时候点击有效
          return
        }
        const index=this.currentindex+1
        const maxindex=this.playlist.length-1
        if(index>maxindex){
          this.songindex(0)
        }else{
          this.songindex(index)
        } 
        this.setplaying(true)
        this.nextreday=false
      },
      previous(){
        if(!this.nextreday){
          return
        }
        const index=this.currentindex
        //console.log(index)
        const maxindex=this.playlist.length-1
        if(index<=0){
          this.songindex(maxindex)
        }else {
          this.songindex(this.currentindex-1) 
        } 
         this.setplaying(true)
         this.nextreday=false
      },
      songreday(){    //更换歌曲初始状态
        this.nextreday=true       
      },
      timeupdate(){   //当前播放时间发生改变的时候
        if(this.touch.initiated){  //解决滑动进度条的时候和timeupdate事件冲突
          return
        }
        this.currentTime= this.$refs.audio.currentTime   //当前播放时间，需要转格式
        let schedule=(Math.floor(this.currentTime)/ Math.floor(this.currentsong.duration))*100  //宽度百分比
        const barwidth=this.$refs.bgyellow.clientWidth-8  //小球偏移值
        //console.log(barwidth)
        this.$refs.bgyellow.style.width=`${schedule}%`
        this.$refs.iconyellow.style.left = `${barwidth}px`
      },
      timelint(currentTime){
        //console.log(currentTime)
        const minute=Math.floor(Math.floor(currentTime)/60)
        const sec=this.zero(Math.floor(currentTime)%60)  //获得的时间格式的秒要补0
        return `${minute}:${sec}`   
      },
      zero(num,n=2){
        let len = num.toString().length
        while(len<n){
          num='0'+ num
          len++
        }
        return num
      },
      touchstart(e){
        this.touch.initiated=true
        this.touch.startx=e.touches[0].clientX
        this.touch.left=this.$refs.bgyellow.clientWidth
        //console.log(this.touch.left)
      },
      touchmove(e){
        if(!this.touch.initiated){
          return
        }
        const deltax=e.touches[0].pageX - this.touch.startx  //获取滑动时候偏移的值
        const offsetwitch=Math.min(this.$refs.linebar.clientWidth-15, Math.max(0,this.touch.left+deltax))  //小球偏移距离，并且限制最大值，小于bar的宽
        //记录最后滑动到的位置offsetwitch，在滑动结束后要计算歌曲播放位置
        //this.touch.offsetwitch=offsetwitch  在滑动结束后用
        this.touch.offsetwitch=offsetwitch+15  //进度条的总长，用来计算歌曲播放进度百分比this.touch.songtime
        //总进度占据总进度条的百分比
        this.touch.songtime=Math.floor((Math.floor(this.touch.offsetwitch)/this.$refs.linebar.clientWidth)*100)
        
        this.$refs.bgyellow.style.width=`${offsetwitch}px`
        this.$refs.iconyellow.style.left = `${offsetwitch}px`
      },
      touchend(){
        this.touch.initiated=false   //拖动结束时候改变歌曲播放时间       
        const songnum = this.currentsong.duration  //歌曲总长。与进度百分比对应
        //console.log() 
        
        this.$refs.audio.currentTime=songnum*(this.touch.songtime/100)     
      },
      changetime(e){  //点击进度条定位播放位置
        //const linex= e.offsetX   //点击位置  改：当点击到小球的时候位置不对
        const nowloc= this.$refs.linebar.getBoundingClientRect()  //getBoundingClientRect()获取元素的四个位置
        const linex= e.pageX-nowloc.left        
        const songnum = this.currentsong.duration  //歌曲总长
        this.$refs.bgyellow.style.width=`${linex}px`
        this.$refs.iconyellow.style.left = `${linex}px`
        //计算进度百分比
        const timeloc= Math.floor((linex/this.$refs.linebar.clientWidth)*100)
        this.$refs.audio.currentTime=songnum*(timeloc/100)
      },
      ended(){
        this.next()
      },
      ...mapMutations({
        setFullScreen: 'SET_fullscreen',
        setplayingstate:'SET_playing',
        songindex:'SET_currentindex',
        setplaying:'SET_playing',
        modestate:'SET_mode',
        setplaylist:'SET_playlist'
      })
    },
    created(){
      this.touch={}   //存储touch数据
    },
    watch:{
      currentsong(){
        this.$nextTick( function(){
          this.$refs.audio.play()          
       })       
      },
      playing(newstate){
        const audio = this.$refs.audio
        this.$nextTick(()=>{
          newstate ? audio.play() : audio.pause()
        })       
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .player{   
    .normal-player{
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 1000;
      width: 100%;
      background: #222;
      .bgimg{
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        webkit-filter: blur(20px);
        filter: blur(20px);
        img{
          width: 100%;
          height: 100%;
        }
      }
      .top{
        position: relative;
        .close{
          font-size: 14px;
          color: #FFCD32;
          position: absolute;
          left: 20px;
          top: 20px;
        }
        .title{
          width: 70%;
          margin: 0 auto;
          line-height: 80px;
          text-align: center;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 18px;
          color: #fff;          
        }
        .singername{
          line-height: 40px;
          text-align: center;
          font-size: 14px;
          color: #fff;
          
        }
      }
      .cdwrap{
        position: fixed;
        width: 100%;
        top: 160px;
        bottom: 340px;      
        font-size: 0;
        .cdimg{
          margin:0 auto;
          width: 600px;
          height: 600px;
          border-radius:50%;
          border:10px solid rgba(255,255,255,0.1); 
          &.imgrotate{
            animation: rotate 15s linear infinite; 
          }      
          &.stop{
            animation-play-state: paused;
            animation-fill-mode:forwards;
          }             
          img{
            width: 100%;
            height:100%;
            border-radius: 50%;
          }
        }
      }
      .bottom{
        position: fixed;
        bottom: 100px;
        width: 100%;
        .operators{
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          .icon{
            -webkit-box-flex: 1;
            -ms-flex: 1;
            flex: 1;
            color: #ffcd32;
            &.i-left{
              text-align: right;             
            }
            &.i-center{
              text-align: center;
              padding: 0 20px;
              i{
                font-size: 40px;
              }
            }
            &.i-right{
              text-align: left;
            }
            i{
              font-size: 30px;
            }
          }
        }   
        .bar-inner{
          display: flex;
          width: 80%;
          align-items: center;         
          margin: 0 auto 20px auto;
          .nowtime,.time{
            flex: 0 0 60px;
            text-align: center;
          }
          .linebar{
            flex: 1 ;
            height: 8px;
            margin: 0 10px;
            position: relative;
            background: rgba(0,0,0,0.3);
            .bgyellow{
              width: 1px;
              height: 100%;
              background: #FFCD2B;
              position:relative;
            }
            .iconyellow{
              width: 15px;
              height: 15px;
              border-radius: 50%;
              border: 3px solid #FFFFFF;
              background: #FFCD2B;
              position: absolute;               
              left: -8px;
              top: -7px;
            }           
          }
        }     
      }
    }
    .min-player{
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 1000;
      width: 100%;
      height: 120px;
      background: #333;
      .mincdimg{
        flex: 0 0 80px;
        width: 80px;
        padding: 0 30px 0 40px;
        &.imgrotate{
          animation: rotate 15s linear infinite; 
        }      
        &.stop{
          animation-play-state: paused;
          animation-fill-mode:forwards;
        } 
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .content{
        flex: 1;
        display: flex;
        flex-direction:column;
        line-height: 40px;
        .songname{
          margin-bottom: 4px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 14px;
          color: #fff;
        }
        .name{
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 12px;
          color: rgba(255,255,255,0.3);
        }
      }
      .control{
        flex: 0 0 60px;
        width: 60px;
        padding: 0 10px;
        .controlicon{
          font-size: 30px;
          color: #ffcd32;
        }
      }
    }    
    .normal-enter-active, .normal-leave-active{
      transition: all .3s;
      .top, .bottom{
         transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      }        
    }
    .normal-enter,.normal-leave-to{
      opacity: 0;
      .top{
        transform: translate3d(0,-100px,0);
      }
      .bottom{
        transform: translate3d(0,100px,0);
      }
    }
    @keyframes rotate{
    	0%{
    	  transform: rotate(0);
    	}
    	100%{
    	  transform: rotate(360deg);
    	}
    }
  }
</style>