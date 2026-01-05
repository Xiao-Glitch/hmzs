<template>
  <button :class="className" @click="clickHandle">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'SfButton',
  props: {
    size: {
      type: String,
      default: 'mini'
    }
  },
  computed: {
    className() {
      return this.size
    }
  },
  methods: {
    clickHandle() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>

.mini {
  padding: 20px;
}

.large {
  padding: 40px;
}
</style>
