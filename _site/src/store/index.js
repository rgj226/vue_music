import vue from 'vue'
import vuex from 'vuex'
import mutations from './mutations'
import state from './state'
import * as getters from './getters'
import * as actions from './actions'
//控制台打印每次的修改日志。原始内容和此次的变更内容
import cretelogger from 'vuex/dist/logger'

vue.use(vuex)

//启用严格模式，检测数据的变化是否是从mutation中改变
const debug = process.env.NODE_ENV !== 'production'

export default new vuex.Store({
  mutations,
  state,
  getters,
  actions,
  strict:debug,    //开区严格模式
  plugins:debug?[cretelogger()]:[]
})

