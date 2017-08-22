import * as type from './mutation-type'
import {playmode} from '../common/js/palyconfig'
import {shuffle} from '../common/js/shuffle'  //洗牌函数

function findindex(list,song){
  return list.findIndex((item)=>{  //在随机列表中找到对应名字一致的
    return item.name===song.name
  })
}

//点击歌曲名称后要改变播放状态，播放页面展开，当前播放的歌曲,播放列表
export const selectplay =function({commit,state},{list,index}){
  commit(type.SET_sequencelist,list)
  //判断是否是随机播放
  if(state.mode===playmode.random){
    let randomlist=shuffle(list)
    commit(type.SET_playlist,randomlist)  //解决在点击歌曲列表中的歌曲时候，随机列表中的歌曲要对应到此歌曲    
    index = findindex(randomlist,list[index])  //传入随机列表，以及当前歌曲索引
    console.log(index)
  }else{
    commit(type.SET_playlist,list)
  }  
  commit(type.SET_currentindex,index)
  commit(type.SET_fullscreen,true)
  commit(type.SET_playing,true) 
}

export const randomplaylist=function({commit},{list}){  //点击随机播放按钮。产生一个随机播放列表，更改播放状态，播放开始位置
  commit(type.SET_mode,playmode.random)
  commit(type.SET_sequencelist,list)
  
  commit(type.SET_playlist,shuffle(list))
  commit(type.SET_currentindex,0)  
  commit(type.SET_fullscreen,true)
  commit(type.SET_playing,true) 
}
