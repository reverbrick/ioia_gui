<template>
  <div>
    <Table ref="table" v-on:openPopup="openPopup" v-on:editRow="editRow" v-on:showDetails="showDetails" tclass="sticky-header-60"/>
    <TableDetail ref="detail" v-on:openPopup="openPopup" v-on:editRow="editRow" v-on:showDetails="showDetails" tclass="sticky-header-40"/>
    <q-dialog v-model="popup" persistent>
      <Form ref="form" v-on:openPopup="openPopup" v-on:loadData="loadData" />
    </q-dialog>
  </div>
</template>

<script>
import Table from 'components/Table'
import TableDetail from 'components/TableDetail'
import Form from 'components/Form'
export default {
  components: {
    Table,
    TableDetail,
    Form
  },
  watch: {
    $route: function (newVal) {
      this.$refs.detail.clearDetails()
    }
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
      this.$nextTick(() => { this.$refs.table.loadData() })
    },
    editRow (val) {
      this.popup = true
      this.$nextTick(() => { this.$refs.form.loadForm(val) })
    },
    showDetails (row, columns) {
      this.$refs.detail.showDetails(row, columns)
    }
  }
}
</script>
