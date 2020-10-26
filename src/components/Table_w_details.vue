<template>
  <q-table dense :data="data" :title="title" :columns="columns" :row-key="data.id" :pagination.sync="pagination" :loading="loading" :filter="filter" @request="loadData" binary-state-sort separator="cell" @row-click="editRow">
    <template v-slot:top-right>
      <q-btn class="q-ml-sm" dense color="primary" glossy icon="note_add" @click="openPopup(true)" />
      <q-btn class="q-ml-sm" color="info" dense glossy icon="file_copy" label="CSV" no-caps @click="csv"/>
      <q-btn class="q-ml-sm" color="amber" dense glossy icon-right="refresh" @click="refresh" />
    </template>
    <template v-slot:body="props">
      <q-tr :props="props" :key="`m_${props.row.id}`">
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
        >
          {{ col.value }}
        </q-td>
      </q-tr>
      <q-tr :props="props" :key="`e_${props.row.id}`" class="q-virtual-scroll--with-prev">
        <q-td colspan="100%">
          <div v-for="line in props.row.pozycje" v-bind:key="line.id" class="text-left">Produkt: {{ line.produkt }}, Producent: {{ line.producent }}</div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { axiosGet } from '../boot/ioia.js'
export default {
  props: ['model'],
  data () {
    return {
      filter: '',
      loading: false,
      pagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      data: [],
      columns: [],
      title: ''
    }
  },
  mounted: function () {
    // this.loadData()
  },
  watch: {
    '$route.params.id': {
      handler: function () {
        this.loadData()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    loadCallback (data) {
      this.title = data.list_title
      for (const id in data.ids) {
        this.data[id].id = data.ids[id]
      }
      this.pagination.rowsNumber = data.count
      this.columns = []
      for (const col in data.list_columns) {
        this.columns.push({
          name: data.list_columns[col],
          align: 'left',
          label: data.label_columns[data.list_columns[col]],
          field: data.list_columns[col],
          sortable: data.order_columns.includes(data.list_columns[col])
        })
      }
    },
    loadData () {
      axiosGet(this, this.model, 'data', `${this.model}/`, this.loadCallback)
    },
    openPopup (val) {
      // this.$emit('openPopup', val)
      this.$emit('editRow', '0')
    },
    editRow (evt, row) {
      this.$emit('editRow', row.id)
      this.$emit('viewRow', row)
    },
    csv () {
      this.$q.notify({
        message: 'Export',
        color: 'info'
      })
    },
    refresh () {
      this.loadData()
    },
    resetSearch () {
      this.filter = ''
      this.loadData({
        pagination: this.pagination,
        filter: ''
      })
      this.$refs.search.focus()
    }
  }
}
</script>
