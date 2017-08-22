<!--singerdetail子组件-->

<template>
  <div class="song">
     <span class="back" @click="back">返回</span>
     <span class="title" v-html="title"></span>
     <div class="head" v-bind:style="imgbg" ref="bgimg">
       <div class="filter" ref="filter">
         <div @click="random" class="randomplay" ref="randomplay">
           <p>随机播放</p>
         </div>
       </div>
     </div>

   <!--滚动效果，滚动时候layer的transform值跟着改变-->
   <!--通过设置滚动的最大值，来停止transform。防止超出屏幕-->
   <div class="layer" ref="layers"></div>  
   <scroll @scroll='scroll' :listenScroll='listenScroll' :probeType='probeType' :data="songs" class="list" ref="list">
     <div class="listsone">
       <songlist :rank="true" @select='selectitem' :songs="songs"></songlist>
     </div>
   </scroll>  
  </div>
</template>

<script type="text/ecmascript-6">  
  import scroll from '../../base/scroll/scroll'
  import songlist from '../song/song-list'
  import {mapActions} from 'vuex'
  import {playmixin} from '../../common/js/mixin.js'
  const headerheight=80
  export default {
    mixins: [playmixin],
    data(){
      return{  
        listenScroll:true,
        probeType:3,
        scrolly:0
      }
    },
    props:{
      songs:{
        type:Array,
        default:[]
      },
      bgimage:{
        type:String,
        default:""
      },
      title:{
        type:String,
        default:""
      }
    },
    computed:{
      imgbg(){
        return `background-image:url(${this.bgimage})`
      }
    },
    methods:{
      scroll(pos){  //获取滚动的高度
        this.scrolly=pos.y        
      },
      back(){
        this.$router.back()
      },
      selectitem(item,index){
        //console.log(index)
       this.selectplay({
         list:this.songs,
         index
       })
      },
      random(){
       this.randomplaylist({  //点击随机播放，在action中改变播放状态值，播放列表洗牌，播放第一首歌索引值
         list:this.songs
       })
      },
      handplaylist(playlist){
       const bottom = playlist.length>0?'120px':''  
       this.$refs.list.$el.style.bottom=bottom
       this.$refs.list.refresh()
      },
      ...mapActions([
          'selectplay',
          'randomplaylist'
        ])
    },
    watch:{
      scrolly(newy){  //当滚动高度变化的时候给layer增加偏移样式transform: translate3d(0px, 0px, 0px);       
        let maximgheight=-this.imgheight
        let translatey= -this.imgheight+headerheight  //偏移最大值为图片的高度减去导航栏高度
        let height=Math.max(translatey,newy)
        let zindex=0
        let scale=1  //缩放比例
        let blur =0  //模糊值  当向上的滑动值越大，模糊值越大
        let percent=Math.abs(newy/this.imgheight)
        
        this.$refs.layers.style['transform'] = `translate3d(0,${height}px,0)`
        this.$refs.layers.style['webkitTransform']=`translate3d(0,${height}px,0)`
        if(newy<maximgheight){  //如果滚动的值小于图片的取反高度，改变背景图的高度以及z-index
          zindex=20
          this.$refs.bgimg.style.height=`${headerheight}px`
          this.$refs.bgimg.style.padding=`${0}px`
          this.$refs.randomplay.style.display=`none`
        }else{
          this.$refs.bgimg.style.height=0
          this.$refs.bgimg.style.paddingTop=`70%`
          this.$refs.randomplay.style.display=`block`
        }
        if(newy>0){
          scale=scale+percent  //滑动到底部后设置缩放
          zindex=20
        }else{
          blur=Math.min(20*percent,20)  //模糊效果值计算
        }
        this.$refs.bgimg.style['transform'] = `scale(${scale})`
        this.$refs.bgimg.style.zIndex=zindex
//      模糊效果样式
        this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
      }
    },
    mounted(){   
      this.imgheight=`${this.$refs.bgimg.clientHeight}`    //图片的高度
      this.$refs.list.$el.style.top=`${this.imgheight}px`  //元素创建的时候设置scroll的位置。保证在背景图的下方
    },
    components:{
      songlist,
      scroll
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
 .song{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #222;
   .back{
    display: inline-block;
    position: absolute;
    top: 0;
    left: 12px;
    z-index: 50;
    font-size: 12px;
    color: #FFCD32;
    padding: 20px;
    color: #ffcd32;
   }
   .title{
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    line-height: 80px;
    font-size: 18px;
    color: #fff;
   }
   .head{
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    -webkit-transform-origin: top;
    transform-origin: top;
    background-size: cover;
    .filter{
      width: 100%;      
      height: 100%;
      background: rgba(0,0,0,0.4);
      position: absolute;
      left: 0;
      top: 0;
      .randomplay{
       position: absolute;
       bottom: 40px;
       text-align: center;
       width: 100%;
        p{
          font-size: 14px;
          color: #FFCD2B;
          display: inline-block;
          margin: 0 auto;
          border: 1px solid #FFCD2B;
          border-radius: 40px;
          padding: 20px 75px;
          line-height: 32px;
        }
      }
    }
   }
  .list{
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #222;
  }
  .layer{
    position: relative;
    height: 100%;
    background: #222;
  }
 }
</style>