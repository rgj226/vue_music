export const singer=state=>state.singer  //映射mutations修改后的数据到组件中

export const playing=state=>state.playing

export const fullscreen=state=>state.fullscreen

export const playlist=state=>state.playlist

export const sequencelist=state=>state.sequencelist

export const mode=state=>state.mode

export const currentindex=state=>state.currentindex

export const currentsong=(state)=>{
  return state.playlist[state.currentindex] || {} 
}

export const disc=state=>state.disc

export const ranking=state=>state.ranking