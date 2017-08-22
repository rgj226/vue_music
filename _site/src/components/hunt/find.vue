<template>
  <div class="find">
    <span class="icon icon-find"></span>
    <input v-model="query" type="text" :placeholder="placeholder" />
    <span @click="clear" v-show="query" class="close">X</span>
  </div>
</template>

<script type="text/ecmascript-6">  
  export default {
    props:{
      placeholder:{
        type:String,
        default:'搜索歌曲、歌手'
      }
    },
    data(){
     return {
       query:''
     }
    },
    methods:{
      clear(){
        this.query=''
      },
      setquery(query){
        this.query=query
      }
    },
    watch:{  
      query(newquery){
        this.$emit('query',newquery)
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .find{
    width: 100%;
    padding:25px 0;
    height: 35px;
    background: #333333;
    border-radius: 12px;
    display: flex;
    position: relative;
    .icon{     
      display: inline-block;
      font-size: 24px;
      position: absolute;
      left: 0;
      top: 15px;
      color: #222222;
    }
    input{
      height: 100%;
      flex: 1 ;
      text-indent: 45px;
      background: #333333;
    }
    .close{
      position: absolute;
      right: 5px;
      top: 20px;
      display: inline-block;
      width: 40px;
      height: 40px;
      font-size: 12px;
      border-radius: 50%;
      background: #222222;
      text-align: center;
      line-height: 40px;
    }
  }
</style>