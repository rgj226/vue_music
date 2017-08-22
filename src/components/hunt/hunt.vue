<template>
<div class="hunt">
  <div class="findwrap">
    <find ref='find' @query='onquerychange'></find>
  </div>
  <div class="hotwarp">
    <div class="hot">
      <h1 class="title">热门搜索</h1>
      <ul class="hotlist">
        <li @click="upinput(item.k)" v-for="item in hotkey">{{item.k}}</li>
      </ul>
    </div>
  </div>  
  <div class="huntlistwarp" v-show="query">
    <huntlist :query="query" @listscroll='blurinput'></huntlist>
  </div> 
  <router-view></router-view>
</div>
</template>

<script type="text/ecmascript-6"> 

  import find from './find'
  import huntlist from './huntlist'
  import {mapActions} from 'vuex'
  export default {
    data(){
      return{
        hotkey:[],
        query:''
      }
    },
    created(){
      var url='https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
      this.$http.get('https://bird.ioliu.cn/v1/?url='+url ,{params: {
        g_tk:5381,
        uin:0,
        inCharset:'utf-8',
        outCharset:'utf-8',
        notice:0,
        platform:'h5',
        needNewCode:1,
        _:1502938081043,
        format: 'json'   //规定返回的类型   
      }}).then(response => {
        response=response.body; 
        this.hotkey=response.data.hotkey.slice(0,10)
        console.log(this.hotkey)        
      })
    },
    methods:{
      upinput(query){
        this.$refs.find.setquery(query)
      },
      onquerychange(query){
        this.query=query
      },
      selectitem(item){
        console.log(item)
      },
      blurinput(){
        this.$refs.find.blur()
      }
    },
    components:{
      find,
      huntlist,
      scroll
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .hunt{
    .findwrap{
      padding: 40px;   
    }
    .hotwarp{
       padding: 40px;
      .title{      
        font-size: 14px;
        color: rgba(255,255,255,0.5);
        margin-bottom: 35px;
      }
      .hotlist{
        li{
          display: inline-block;
          font-size: 14px;
          color:rgba(255,255,255,0.3);
          padding: 8px 15px;
          line-height: 34px;
          border-radius: 8px;
          background: #333333;
          margin: 0 30px 30px 0;
        }
      }
    }
    .huntlistwarp{
      position: fixed;
      left: 0;
      top: 320px;
      bottom: 0;
      width: 100%;   
      padding-bottom: 20px;   
    }
  }
  
</style>