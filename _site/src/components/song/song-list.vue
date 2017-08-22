<!--song子组件-->
<template>
  <div class="song-list">
    <ul>
      <li @click="selectitem(song,index)" v-for="(song,index) in songs" class="songitem">
        <div class="ranksinger" v-show="rank">
          <span class="icon" :class="getcla(index)">{{gettext(index)}}</span>
        </div>
        <div class="content">
          <p class="songnanme">{{song.name}}</p>
          <p class="zhunjiname">{{song.album}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">  
  export default {
    props:{
      rank:{
        type:Boolean,
        default:false
      },
      songs:{
        type:Array,
        default:[]
      }
    },
    methods:{
      selectitem(item,index){
        this.$emit('select',item,index)
      },
      getcla(index){
        if(index<=2){
          return `icon${index}`
        }else{
          return 'text'
        }
      },
      gettext(index){
        if(index>2){
          return index+1
        }
      }
    }   
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .song-list{
    padding: 40px 60px;
    .songitem{
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 128px;
      font-size: 14px;
      .content{
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .songnanme{
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          color: #fff;
          line-height: 40px;
        }
        .zhunjiname{
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          margin-top: 8px;
          line-height: 40px;
          color: rgba(255,255,255,0.3);
        }       
      }
      .ranksinger{
        flex: 0 0 50px;
        width: 50px;
        margin-right: 60px;
        text-align: center;  
        .text{
          color: #ffcd32;
          font-size: 18px;
        }
        .icon{
          display: inline-block;
          width: 50px;
          height: 48px;
          background-size: 50px 48px;
          &.icon0{
            background: url(first@2x.png);
          }
          &.icon1{
            background: url(second@2x.png);
          }
          &.icon2{
            background: url(third@2x.png);
          }
        }
      }
    }
  }
</style>