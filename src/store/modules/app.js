// import util from '@/libs/util'
import Vue from 'vue'
import db from '@/libs/db'

const saveState = function (state) {
  db.set('vuex.app', state).write()
}

const MAX_SEARCH_HISTORY = 20

export default {
  namespaced: true,
  state: {
    searchHistoryList: [], // 图书搜索记录
    resources: []
  },
  mutations: {
    // 添加历史记录
    addTextToSearchHistoryList (state, text) {
      if(text.replace(/(^\s*)|(\s*$)/g, '')){
        // 判断重复
        let indexTemp= state.searchHistoryList.indexOf(text)
        if(indexTemp > -1){
          state.searchHistoryList.splice(indexTemp, 1)
        }

        // 添加到开头
        state.searchHistoryList.unshift(text)
        // 超出限制删除末尾的
        if(state.searchHistoryList.length > MAX_SEARCH_HISTORY){
          state.searchHistoryList.pop()
        }
        saveState(state)
      }
    },
    // 删除历史记录
    removeTextFromSearchHistoryList (state, index) {
      state.searchHistoryList.splice(index, 1)
      saveState(state)
    },
    // 清空历史记录
    clearSearchHistorylist (state) {
      state.searchHistoryList = []
      saveState(state)
    },
    // 添加资源
    addResource(state, resource){
      if(!resource || !resource.name || !resource.fileList){
        Vue.prototype.$toast('资源格式不正确')
        return
      }
      state.resources.push(resource)
      saveState(state)
    },
    // 删除历史记录
    removeResource(state, index) {
      if(index > state.resources.length){
        Vue.prototype.$toast('删除错误，索引不正确！')
        return
      }
      state.resources.splice(index, 1)
      saveState(state)
    },
  },
  actions: {
  }
}
