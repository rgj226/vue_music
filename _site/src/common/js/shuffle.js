   function getrandomint(min,max){
    return Math.floor(Math.random()*(max-min+1)+min)
  }
  export  function shuffle(arr){ //将歌曲数据随机打乱
    let _arr=arr.slice()   //该方法并不会修改数组，而是返回一个子数组
    for(let i=0;i<_arr.length;i++){
      let j=getrandomint(0,i)
      let t=_arr[i]
      _arr[i]=_arr[j]
      _arr[j]=t
    }
    return _arr
  }