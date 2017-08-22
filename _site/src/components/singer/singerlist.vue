<!--singer子组件-->

<template>
  <scroll :data ="data" 
    class="listview" 
    ref="listview" 
    :listen-scroll="listenScroll"
    :probe-type="this.probeType"
    @scroll="scroll"
    >
    <ul ref="list">
      <li v-for="item in data" class="listgroup" >
        <h2 class="title">{{item.title}}</h2>
        <ul>
          <!--点击歌手的时候需要派发事件，知道点击的是哪个-->
          <li v-for="(list,index) in item.items" class="listitem" @click="singerdetail(list)">
            <img v-lazy="list.avatar" alt="" class="avater" />
            <span>{{list.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="f-index" >
      <ul>
        <li v-for="(item,index) in indexcread" @click="ontachstart(index,$event)" class="indexitem" :class="{'current':currentindex===index}"  :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="flextop" v-show="fixedtitle" ref="flexd">
      <h2>{{fixedtitle}}</h2>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">  
  import scroll from '../../base/scroll/scroll'
  export default {
    data(){
      return {
        indexlist:[],
        scrolly:-1,
        listheight:[],
        currentindex:0,
        probeType:3,
        diff:-1
      }
    },
    created() {
      this.listenScroll=true
    },
    props:{
      data:{
        type:Array
      }
    },
    computed:{
      indexcread(){  //获取右侧快速入口内容
        let list=[]
        for (let i=0;i<this.data.length;i++) {
        	list.push(this.data[i].title.substr(0, 1))
        }
        return list
      },
      fixedtitle(){  //fixedtitlex显示以及内容
        if(this.scrolly>0){
          return ''
        }
        return this.data[this.currentindex]?this.data[this.currentindex].title:''
      }
    },
    methods:{
      singerdetail(item){  //点击派发事件，在需要接收事件派发的地方@select事件
        this.$emit('select',item)
      },
      ontachstart(index,event){  //根据点击的元素，滚动到联动的位置元素
        //console.log(index)
        let foodlist=this.$refs.list.getElementsByClassName("listgroup")
        let el=foodlist[index]
        this.currentindex=index
        this.$refs.listview.scrollToElement(el,0)
      },
      scroll(pos){   //bscroll插件方法，实时获取滚动位置
        //this.scrolly=Math.abs(parseInt(pos.y)) 
        this.scrolly=pos.y
      },
      calculateheight(){
        //获取每个区块高度区间
        let foodlist=this.$refs.list.getElementsByClassName("listgroup")
        let height =0;
        this.listheight.push(height);          //设置第一个区块的高度为0
        for(let i =0;i<foodlist.length;i++){   //遍历所有的区块
          height += foodlist[i].clientHeight;  //每个区块的高度总和
          this.listheight.push(height);        //获取到每个区块高度的数组
          //console.log(this.listheight)
        }       
      },
      refresh(){
        this.$refs.listview.refresh()
      }     
    },
    watch:{
      data(){   //数据变化的时候计算歌手列表的各个区间高度
        setTimeout(()=>{
          this.calculateheight()
        },20)
      },
      scrolly(newY){  //newY需要取反为正数在做判断
        for(let i=0;i<this.listheight.length;i++){ //判断滚动区间.
          let height1=this.listheight[i];
          let height2=this.listheight[i + 1];
          if(!height2||(-newY>=height1 && -newY<height2)){           
            this.currentindex=i
            this.diff=height2+newY   //计算到区块最底部与滚动至区块最底部的差
            //console.log(this.currentindex)
            return 
          }
        } 
        return 0;
      },
      diff(newval){
        let top=(newval>0 && newval<60)?newval-60:0   
        this.$refs.flexd.style.transform=`translate3d(0,${top}px,0)`
      }
      
    },
    components:{
      scroll
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .listview{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #222;
    .title{
      height: 60px;
      line-height: 60px;
      padding-left: 40px;
      font-size: 12px;
      color: rgba(255,255,255,0.5);
      background: #333
    }
    .listgroup{
      padding-bottom: 60px;
    }
    .listitem{
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      padding: 40px 0 0 60px;
      .avater{
        width: 100px;
        height: 100px;
        border-radius: 50%
      }
      span{
        margin-left: 40px;
        color: rgba(255,255,255,0.5);
        font-size: 14px
      }
    }
    .f-index{
      position: absolute;
      z-index: 30;
      right: 10px;
      top: 50%;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
      width: 40px;
      padding: 40px 0;
      border-radius: 20px;
      text-align: center;
      background: rgba(0,0,0,0.3);
      font-family: Helvetica;
      .indexitem{
        padding: 6px;
        line-height: 1;
        color: rgba(255,255,255,0.5);
        font-size: 12px;
        &.current{
          color: #FFCD32;
        }
      }
    }   
    .flextop{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      h2{
        height: 60px;
        line-height: 60px;
        padding-left: 40px;
        font-size: 12px;
        color: rgba(255,255,255,0.5);
        background: #333;
      }
    } 
  }
</style>