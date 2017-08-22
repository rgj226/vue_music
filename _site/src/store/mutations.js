import * as type from './mutation-type'

const mutations ={
  [type.SET_SINGER](state,singer){
    state.singer=singer
  },
  [type.SET_playing](state,flag){
    state.playing=flag
  },
  [type.SET_fullscreen](state,flag){
    state.fullscreen=flag
  },
  [type.SET_playlist](state,list){
    state.playlist=list
  },
  [type.SET_sequencelist](state,list){
    state.sequencelist=list
  },
  [type.SET_mode](state,mode){
    state.mode=mode
  },
  [type.SET_currentindex](state,index){
    state.currentindex=index
  }, 
  //歌单详情数据
  [type.SET_disc](state,item){
    state.disc=item
  },
  [type.SET_ranking](state,item){
    state.ranking=item
  }
}

export default mutations