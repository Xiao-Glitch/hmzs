<template>
  <div>
    行车管理-区域管理
    <sf-Button size="mini" @click="clickHandle"> mini </sf-Button>
    <sf-Button size="large"> large </sf-Button>
  </div>
</template>

<script>
import sfButton from '@/components/sf-button'
export default {
  components: {
    sfButton
  },
  methods: {
    clickHandle() {
      console.log('click')
    }
  }
}
</script>
