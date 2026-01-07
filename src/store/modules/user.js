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
      ctx.commit('setProfile', res.data)
      return res.data.permissions
    }
  }
}
