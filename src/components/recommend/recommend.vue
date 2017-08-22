<template>
  <div class="recommend" ref='recommend'>
    <scroll ref="scroll" :data='disc' class="scrollwrp">
      <div class="main">
        <div class="lunbo">
          <mt-swipe :auto="3000">
            <mt-swipe-item v-for="item in recommendlist" :key="item.id">
              <a :href="item.linkUrl" class="alink" >
               <!-- 为图片添加load事件，为了防止数据后加载影响页面高度而滚动不到底-->
               <!-- fastclick会拦截点击事件，添加class needsclick取消掉拦截。否则会跳转失效-->
                <img class="needsclick" @load="imgload"  :src="item.picUrl" alt="" />  
              </a>
            </mt-swipe-item>     
          </mt-swipe>
        </div>
        <h1 class="title">热门歌单推荐</h1>
        <div class="listwarp">
          <ul>
            <li v-for="itme in disc" @click="detail(itme)">
              <div class="main">
                <img class="listimg"  v-lazy="itme.imgurl" />
                <p class="notice">{{itme.dissname}}</p>
                <p class="author">{{itme.creator.name}}</p>
              </div>           
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div> 
</template>

<script type="text/ecmascript-6">  
  import scroll from '../../base/scroll/scroll'
  import {playmixin} from '../../common/js/mixin.js'
  import {mapMutations} from 'vuex'
  export default {
    mixins: [playmixin],
    data(){
      return{
        recommendlist:[],
        disc:[]
      }
    },
    created(){  
//    首页banner
      var url='https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
      this.$http.get('https://bird.ioliu.cn/v1/?url='+url ,{params: {g_tk:'1067216704',uin:'0',inCharset:'utf-8',outCharset:'utf-8'}}).then(response => {
        response=response.body;      
        this.recommendlist=  response.data.slider 
      })      
//    歌单请求。提示：在params中的参数要与qq音乐官网的参数一致query string Parma eters
      this.$http.get('/api/getDiscList',{params: {
        platform: 'yqq',
        hostUin: 0,
        sin: 0,
        inCharset:'utf-8',
        outCharset:'utf-8',
        ein: 29,
        sortId: 5,
        needNewCode: 0,
        categoryId: 10000000,
        rnd: Math.random(),
        g_tk:940235217,
        format: 'json'   //规定返回的类型   
      }}).then(response => {
        response=response.body; 
        this.disc=response.data.list
        console.log(response.data.list)        
      })
    },
    methods:{
      imgload(){
        if(!this.scrolls){  //添加变量来判断，只执行一次refresh
          this.$refs.scroll.refresh()
          this.scrolls = true
        }      
      },
      handplaylist(playlist){
        const bottom = playlist.length>0?'125px':''
        this.$refs.recommend.style.bottom=bottom
        this.$refs.scroll.refresh()
      },
      detail(item){
        this.$router.push({
          path:`/recommend/${item.dissid}`          
        })
        this.setdisc(item)
      },
      ...mapMutations({
        setdisc:'SET_disc'
      })
    },
    components:{
      scroll
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .recommend{
    position: fixed;
    top: 176px;
    bottom: 0;
    .scrollwrp{
      overflow: hidden;
      height: 100%;
    }
    .lunbo{
      height: 300px;
      .alink{
        display: block;
        width: 100%;
        height: 100%;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .mint-swipe-indicator{
        width: 16px;
        height: 16px;
        margin: 0 6px;
        &.is-active{
          width: 32px;
          border-radius:8px;
          opacity: 0.4;
        }
      }     
    }
    .title{
      font-size: 14px;
      line-height: 130px;
      height: 130px;
      text-align: center;
      color: #ffcd32;
    }
    .listwarp{
      ul{
        display: flex;
        flex-wrap: wrap;
        padding: 0 20px;
        margin-right: -18px;
        li{
          width: 33.33%;
          margin-bottom: 24px;
          .main{
            margin-right:18px;
            img{
              width: 100%;
              height: 210px;
              &[lazy=loading]{
               width: 40px;
               height: 210px;
               margin:0 auto;
               display: block;
              }                       
            } 
            .notice{
              width: 100%;
              font-size: 10px;
              margin-top: 8px;
              color: #FFFFFF;
              overflow: hidden;
              white-space:nowrap;
              text-overflow:ellipsis;
            }
            .author{
              font-size:10px;
              color:#ccc;
              margin-top: 4px;
            }
          }         
        }
      }
    }
  }
</style>