<template>
  <div class="loading">
    <img src="./loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .loading{
    width: 100%;
    text-align: center;
    img{
      width: 48px;
      height: 48px;
    }
  }   
  .desc{
    line-height: 20px;
    font-size:14px;
    color: #7E8C8D;
  }      
</style>
