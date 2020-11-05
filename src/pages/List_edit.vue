<template>
  <div>
    <Table ref="table" :model="this.$route.params.id" v-on:openPopup="openPopup" v-on:editRow="editRow" />
    <q-dialog v-model="popup" persistent>
      <Form ref="form" :model="this.$route.params.id" v-on:openPopup="openPopup" v-on:loadData="loadData" />
    </q-dialog>
  </div>
</template>

<script>
import Table from 'components/Table'
import Form from 'components/Form'
export default {
  components: {
    Table,
    Form
  },
  data () {
    return {
      popup: false
    }
  },
  mounted: function () {
  },
  methods: {
    openPopup (val) {
      this.popup = val
    },
    loadData () {
      // this.$nextTick(() => { this.$refs.table.loadData() })
    },
    editRow (val) {
      // this.popup = true
      // this.$nextTick(() => { this.$refs.form.loadForm(val) })
    }
  }
}
</script>
