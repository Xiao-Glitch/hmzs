// 放置全局指令
import Vue from 'vue'
import store from '@/store'
// 封装和按钮权限控制相关的指令

// 定义全局指令
Vue.directive('btn-auth', {
  inserted(el, binding) {
    // el: 指令绑定到的dom元素 - button
    // binding。value: 指令的绑定值 v-btn-auth="btnPerm"
    // console.log(el, binding.value)

    // 添加控制按钮显示和隐藏的逻辑
    // 判断当前按钮的权限标识是否在perms中能找到 if 找到 显示 else 隐藏
    const btnPerm = binding.value
    const userPermissions = store.state.user.userProfile.permissions
    console.log(btnPerm, userPermissions)
    if (!userPermissions.includes(btnPerm)) {
      el.remove()
    }
  }
})
