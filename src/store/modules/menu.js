// 默认显示工作台 拿到动态路由表之后 再次组合路由表

import { routes } from '@/router'

export default {
  namespaced: true,
  state: {
    menuList: [...routes] // 存入动态筛选过后的路由表
  },
  mutations: {
    setMenulist(state, asyncRoutes) {
      state.menuList = new Set([...routes, ...asyncRoutes])
    }
  }
}
