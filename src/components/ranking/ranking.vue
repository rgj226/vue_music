<template>
  <div class='rank' ref="rank"> 
    <scroll :data='disc' class="scrollwrp" ref="scroll">
      <div class="rankmain">
       <ul>
         <li class="ranklist" v-for="item in disc" @click="ranklist(item)">
           <img :src="item.picUrl" alt="" />
           <ul class="songlist">
             <li v-for='(song,index) in item.songList'>
               <span>{{index+1}}</span> <span>{{song.songname}}-{{song.singername}}</span>
             </li>
           </ul>
         </li>
       </ul>
      </div>
    </scroll>
    <router-view></router-view>
  </div> 
</template>

<script type="text/ecmascript-6">  
  import scroll from '../../base/scroll/scroll'
  import {mapMutations} from 'vuex'
   import {playmixin} from '../../common/js/mixin.js'
  export default {
    mixins:[playmixin],
    data(){
      return {
        disc:[]
      }
    },
     created(){  
      this.$http.get('/api/getList',{params: {
        g_tk:5381,
        uin:0,
        format:'json',
        inCharset:'utf-8',
        outCharset:'utf-8',
        notice:0,
        platform:'h5',
        needNewCode:1,
        _:1502781571165,
        format: 'json'   //规定返回的类型   
      }}).then(response => {
        response=response.body; 
        this.disc=response.data.topList
        console.log(this.disc)        
      })
    },
    methods:{
      ranklist(item){
        this.$router.push({
           path:`/ranking/${item.id}`                 
        })
        this.setranklist(item)
      },
      handplaylist(playlist){
       const bottom = playlist.length>0?'120px':''  
       this.$refs.rank.style.bottom=bottom
       this.$refs.scroll.refresh()
      },
      ...mapMutations({
        setranklist:'SET_ranking'
      })      
    },
    components:{
      scroll
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .rank{
    position: fixed;
    top: 176px;
    bottom: 0;
    width: 100%;
    .scrollwrp{
      overflow: hidden;
      height: 100%;
    }
    .rankmain{
       padding-bottom: 40px;
      .ranklist{
        display: flex;
        margin: 0 40px;
        padding-top: 40px;
        height: 200px;
        width: 100%;       
        img{
          flex: 0 0 200px;
          width: 100px;
          height: 200px;
        }
        .songlist{
          flex: 1;
          display: flex;
          background: #333;
          padding: 0 40px;
          flex-direction: column;
          justify-content:center;
          overflow: hidden;
          li{
            line-height: 52px;
            color: rgba(255,255,255,0.3);
            font-size: 12px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            padding-right: 40px;
          }
        }
      }
    }
  }
</style>