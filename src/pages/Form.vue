<template>
  <div class="q-pa-md">
    <Form ref="form" :model="this.$route.params.id" v-on:openPopup="openPopup" v-on:loadData="loadData" />
  </div>
</template>

<script>
import Form from 'components/Form'
export default {
  components: {
    Form
  },
  data () {
    return {
      popup: false
    }
  },
  mounted: function () {
  },
  watch: {
    $route: {
      handler: function () {
        this.loadData()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    openPopup (val) {
      this.popup = val
    },
    loadData () {
      this.$nextTick(() => { this.$refs.table.loadData() })
    },
    editRow (val) {
      this.$router.push(`/${this.$route.params.id}/${val}`)
      // this.popup = true
      // this.$nextTick(() => { this.$refs.form.loadForm(val) })
    }
  }
}
</script>
