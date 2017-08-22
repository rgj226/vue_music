<template>
  <div class="header">
    <div class="header-img"><img src="./logo@2x.png" alt="" /></div>
    <h1 class="name">vuemusic</h1>
  </div>
</template>

<script type="text/ecmascript-6">  
  export default {
 
  };
</script>

<style lang="scss" rel="stylesheet/scss">
.header{
  position: relative;
  height: 88px;
  text-align: center;
  color: #ffcd32;
  font-size: 0;
  .header-img{
    display: inline-block;
    width: 60px;
    height: 64px;
    margin-top:12px;
    margin-right:18px;
    vertical-align:top;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .name{
    display: inline-block;
    font-size: 24px;
    line-height: 88px;
    color: #ffcd2b;
  }
}
</style>