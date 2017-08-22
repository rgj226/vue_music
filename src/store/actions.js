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

export const insertsong =function({commit,state},song){
  //playlist应该是一份副本，不然会影响state中的playlist而报错，其他同理
  let playlist =state.playlist.slice()
  let sequencelist=state.sequencelist.slice()
  let currentindex=state.currentindex
  let currentsong= playlist[currentindex]  //当前播放歌曲
  //判断当前播放的列表中是否已经存在要添加的歌曲
  let fpindex=findindex(playlist,song)
  //添加未有，删除已有.插入到当前播放之后,索引加1
  currentindex++
  playlist.splice(currentindex,0,song)
  if(fpindex>-1){ //如果已经存在这首歌，就删除
    //如果插入的这首歌在当前播放歌曲列表的前边，播放过。
    if(currentindex>fpindex){
      playlist.splice(fpindex,1)
      currentindex--
    }else{
      playlist.splice(fpindex+1,1)
    }
  }
  
  //在sequencelist中插入要添加的歌曲。
  //找到要添加的位置，当前播放的歌曲所在sequencelist中，位置后一位
  //在sequencelist中找到当前播放的歌曲位置+1
  let currentsindex=findindex(sequencelist,currentsong)+1
  //判断sequencelist列表中是否存在要添加的歌曲
  let fsindex=findindex(sequencelist,song)
  
  sequencelist.splice(currentsindex,0,song)
  
  if(fsindex>-1){ //如果已经存在这首歌，就删除
    //如果插入的这首歌在当前播放歌曲列表的前边，播放过。
    if(currentsindex>fsindex){
      sequencelist.splice(fsindex,1)
    }else{
      sequencelist.splice(fsindex+1,1)
    }
  }
  
  commit(type.SET_playlist,playlist)
  commit(type.SET_sequencelist,sequencelist)
  commit(type.SET_currentindex,currentindex)
  commit(type.SET_fullscreen,true)
  commit(type.SET_playing,true) 
}
