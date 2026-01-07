// 默认显示工作台 拿到动态路由表之后 再次组合路由表

import { routes, resetRouter } from '@/router'

export default {
  namespaced: true,
  state: {
    menuList: [...routes] // 存入动态筛选过后的路由表
  },
  mutations: {
    setMenulist(state, asyncRoutes) {
      state.menuList = new Set([...routes, ...asyncRoutes])
    },

    // 解决切换用户有缓存的bug
    // 退出清空路由
    resetRouter(state) {
      // 调用清空路由记录的reset方法
      resetRouter()
      // vuex的数据也清空
      state.menuList = [...routes]
    }
  }
}
