// 所有个权限控制相关的事情
import router from './router'
import { getToken } from './utils/auth'
console.log('权限控制模块加载了')

const WHITE_LIST = ['/login', '/404']
// 1.路由前置守卫

router.beforeEach((to, from, next) => {
  // 获取token
  const token = getToken()
  if (token) {
    next()
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
