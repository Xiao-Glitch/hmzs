// 注册子应用
import { registerMicroApps, start } from 'qiankun'

registerMicroApps([
  {
    name: 'big-screen', // app name registered
    entry: '//localhost:5173',
    container: '#bigContainer', // 子应用渲染位置
    activeRule: '/big-screen', // 激活路由
  },
]);

start();
