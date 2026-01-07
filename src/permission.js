// 所有个权限控制相关的事情
import router from './router'
import { asyncRoutes } from './router/asyncRoutes'
import { getToken } from './utils/auth'
import store from './store'
console.log('权限控制模块加载了')

const WHITE_LIST = ['/login', '/404']

// 处理一级路由权限数据
function getFirstRoutePerms(permsArr) {
  const list = permsArr.map(item => {
    return item.split(':')[0]
  })
  return [...new Set(list)]
}

// 处理二级路由权限数据
function getSecondRoutePerms(permsArr) {
  const list = permsArr.map(item => {
    const arr = item.split(':')
    return `${arr[0]}:${arr[1]}`
  })
  return [...new Set(list)]
}

// 根据权限标识过滤路由表
function getRoutes(firstRoutePerms, secondRoutePerms, asyncRoutes) {
  // 一级路由权限数据
  const firstRoute = asyncRoutes.filter(route => {
    return firstRoutePerms.includes(route.permission)
  })
  // 二级路由权限数据
  const secondRoute = firstRoute.map(route => {
    route.children = route.children.filter(item => {
      return secondRoutePerms.includes(item.permission)
    })
    return route
  })
  return [...secondRoute]
}
// 1.路由前置守卫

router.beforeEach(async(to, from, next) => {
  // 获取token
  const token = getToken()
  if (token) {
    next()
    // 没有调用过权限id才放行调用
    if (store.state.user.userProfile.id) return
    // 调用action函数获取用户权限数据
    const perms = await store.dispatch('user/getProfile')
    // 把后端的权限数组格式化
    // console.log(perms)
    const firstRoutePerms = getFirstRoutePerms(perms)
    console.log(firstRoutePerms)
    const secondRoutePerms = getSecondRoutePerms(perms)
    console.log(secondRoutePerms)
    // 根据权限标识 过滤筛选 动态路由表
    // console.log(getRoutes(firstRoutePerms, secondRoutePerms, asyncRoutes))
    const routes = getRoutes(firstRoutePerms, secondRoutePerms, asyncRoutes)
    routes.forEach(route => {
      router.addRoute(route)
    })
    // 调用mutation函数存储路由表
    store.commit('menu/setMenulist', routes)
    // 最终路由表数据
    console.log(routes)
  } else {
    // 没token
    // 是否在白名单内 - 是否在数组中能找到 - path -to.path
    if (WHITE_LIST.includes(to.path)) {
      // 在白名单内
      next()
    } else {
      // 不在白名单内
      next('/login')
    }
  }
})
