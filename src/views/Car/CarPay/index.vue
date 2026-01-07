<!-- <template>
  <div>行车管理-缴费管理</div>
</template> -->

<!-- <template>
  <div>
    <h1 v-if="level === 1">this is h1</h1>
    <h2 v-if="level === 2">this is h2</h2>
    <h3 v-if="level === 3">this is h3</h3>
    <h4 v-if="level === 4">this is h4</h4>
    <h5 v-if="level === 5">this is h5</h5>
    <h6 v-if="level === 6">this is h6</h6>
  </div>
</template> -->

<script>

export default {
  name: 'Park',
  // 写组件模板的另一种方式 直接通过脚本js去写模板
  // h: 方法 作用用来生成虚拟dom节点
  // 第一个参数： 标签名/组件引用
  // 第二个参数： 对于标签/组件的属性配置 （如果是组件 父传子给子组件传入props）
  // 的三个参数： 配置子元素 默认数组 子节点可以有多个 如果只是一个文本节点直接写字符串

  // 结论： template 和 render 都是编写组件模板的方式 绝大部分情况都用 template编写 只有
  // 想利用js的编成能力去写模板的时候才用render函数
  // 即使不写render函数 写的template VUe依旧会把template编译成render函数在浏览器中实际运行的起始还是render

  // render函数适合的场景
  // level: 1 - 6 之间 h1 - h6 标题元素

  data() {
    return {
      level: 1
    }
  },
  // render(h) {
  //   // div-h1
  //   //      -span
  //   return h('div', { class: 'test' }, [
  //     h('h1', {}, 'this is h1'),
  //     h('span', {}, 'this is span')
  //   ])
  // }

  render(h) {
    return h(`h${this.level}`, {}, `this is h${this.level}`)
  }
}
</script>

<style scoped></style>
