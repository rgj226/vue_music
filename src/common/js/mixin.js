//底部min播放组件显示时候不遮挡，增加bottom的兼容mixin.js

import {mapGetters} from 'vuex'

//定义一个对象

export const playmixin={   //mixin所有页面要公用的一段js
  computed:{
    ...mapGetters([
      'playlist'
    ])
  },
  mounted(){     //el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子
    this.handplaylist(this.playlist)
  },
  activated(){   //keep-alive 组件激活时调用。
     this.handplaylist(this.playlist)
  },
  watch:{
    playlist(newlist){
      this.handplaylist(newlist)    //页面播放列表更新时候执行
    }     
  },
  methods:{
    handplaylist(){
      throw new Error ("使用了mixin，但是没有在组件中定义handplaylist函数")
    }
  }
}
