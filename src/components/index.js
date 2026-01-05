// 放置全局组件
// Vue.component('组件名', 组件的配置对象)
// import Vue from 'vue'
import sfButton from './sf-button'

// Vue.component('sf-button', sfButton)

const plugin = {
  install(Vue) {
    Vue.component('sf-button', sfButton)
  }
}

export default plugin
