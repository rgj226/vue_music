<template>
  <div id="app">
    <mheader></mheader>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/recommend"><span>推荐</span></router-link>
      </div>
      <div class="tab-item">
        <router-link to="/singer"><span>歌手</span></router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ranking"><span>排行</span></router-link>
      </div>
      <div class="tab-item">
        <router-link to="/hunt"><span>搜索</span></router-link>
      </div>
    </div>
    <player></player>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    
  </div>
</template>

<script  type="text/ecmascript-6">
import mheader from "./components/header/header"; 
import player from "./components/player/player"; 
export default {
  components:{
    mheader,
    player
  }
}
</script>

<style lang="scss" scoped="" type="text/css">
#app {
  .tab{
    display: flex;
    height: 88px;
    .tab-item{
      flex: 1;
      display: inline-block;
      line-height: 88px;
      text-align: center;
      font-size: 14px;
      a{
        display: inline-block; 
        width: 100%;
        height: 100%; 
        &.router-link-active{
          span{
            border-bottom: 2px solid #FFCD32;
            padding-bottom: 10px;
            color:#FFCD32 ;
          }
        }      
      }
      a:hover{
        text-decoration:none
      }
    }
  }
}
</style>
