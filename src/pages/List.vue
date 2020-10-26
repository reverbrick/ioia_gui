<template>
  <div class="q-pa-md">
    <Table ref="table" :model="this.$route.params.id" v-on:openPopup="openPopup" v-on:editRow="editRow" />
  </div>
</template>

<script>
import Table from 'components/Table'
export default {
  components: {
    Table
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
