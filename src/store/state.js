import {playmode} from '../common/js/palyconfig'

const state ={
  singer:{},
  playing:false,      //是否播放状态
  fullscreen:false,   //是否展开状态
  playlist:[],        //歌曲列表
  sequencelist:[],    //播放模式对应列表
  mode:playmode.sequence,   //播放模式
  currentindex:-1,     //当前播放歌曲
  
  disc:{},   //歌单数据
  ranking:{}  //排行数据
}

export default state