import { loginAPI, getProfileAPI } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: getToken() ?? '',
    userProfile: {} // 用户信息
  },
  // 同步修改Vuex架构中 有且只有一只提交mutation
  mutations: {
    setToken(state, newToken) {
      // 存入vuex
      state.token = newToken
      // cookie也存入一份
      setToken(newToken)
    },
    clearUserInfo(state) {
      state.token = ''
      state.userProfile = {}
      removeToken()
    },
    setProfile(state, userInfo) {
      state.userProfile = userInfo
    }
  },
  actions: {
    async asyncLogin(ctx, { username, password }) {
      // 1.调用登录接口获取token
      const res = await loginAPI({ username, password })
      // 提交mutation
      ctx.commit('setToken', res.data.token)
    },
    async getProfile(ctx) {
      const res = await getProfileAPI()
      if (res.data.permissions[0] === '*:*:*') {
        const { id, name, menus, roleId, roleName } = res.data
        const permissions = ['parking:rule:remove', 'sys:role:remove', 'parking:area:list', 'sys:role:add_edit', 'sys:user:add_edit', 'property:propertyFee:add', 'pole:warning:remove', 'park:enterprise:remove', 'park:enterprise:query', 'parking:card:list', 'park:enterprise:add_edit', 'sys:role:list', 'property:propertyFee:remove', 'sys:user:remove', 'parking:card:add_edit', 'parking:area:remove', 'pole:info:add_edit', 'sys:user:resetPwd', 'parking:rule:list', 'parking:card:recharge', 'sys:user:list', 'parking:rule:add_edit', 'pole:info:remove', 'park:building:add_edit', 'park:rent:remove', 'pole:warning:list', 'pole:warning:query', 'parking:area:add_edit', 'pole:info:list', 'park:enterprise:list', 'park:building:remove', 'park:building:list', 'parking:card:remove', 'pole:warning:send', 'parking:payment:list', 'parking:card:query', 'property:propertyFee:query', 'park:rent:add_surrender']
        const adminData = {
          id,
          name,
          permissions,
          menus,
          roleId,
          roleName
        }
        ctx.commit('setProfile', adminData)
        return permissions
      } else {
        ctx.commit('setProfile', res.data)
        return res.data.permissions
      }
    }
  }
}
