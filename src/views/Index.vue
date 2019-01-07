<template>
  <section class="page-flex">

  </section>
</template>

<script>
  import db from '@/libs/db'

  export default {
    name: 'Index',
    data() {
      return {}
    },
    computed: {},
    watch: {
    },
    methods: {},
    beforeMount() {
      let cacheState = db.get('page.index.state').value()
      Object.assign(this, cacheState)
    },
    mounted() {
    },
    activated() {
      // this.$refs.pageContainer.$el.scrollTop = this.scrollTop
    },
    deactivated() {
      // this.scrollTop = this.$refs.pageContainer.$el.scrollTop
    }
  }
</script>

<style type="text/scss" lang="scss">
</style>
