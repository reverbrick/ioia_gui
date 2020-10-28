<template>
  <q-table dense :data="data" :title="title" :columns="columns" :pagination.sync="pagination" :loading="loading" :filter="filter" @request="loadData" binary-state-sort separator="cell" @row-click="editRow">
    <template v-slot:top-right>
      <q-btn-group>
        <q-btn glossy icon="note_add" dense no-caps label="Dodaj" color="primary" @click="openPopup(true)" />
        <q-input class="q-ml-sm" dense debounce="300" ref="search" v-model="filter" placeholder="Szukaj" v-on:change.prevent="loadData()">
          <template v-slot:append>
            <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetSearch" />
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn-dropdown glossy icon="search" dense no-caps label="Filtry" color="primary">
          <q-form class="q-gutter-md">
            <q-card-section class="q-pt-none q-gutter-md">
              <template v-for="(item, i) in filters">
                <q-toggle v-if="item.type=='boolean'" stack-label :required="item.required" v-bind:key="item.field" v-model="data[fields[i].field]" :label="item.label" :type="item.type"/>
                <q-input v-else stack-label :required="item.required" v-bind:key="item.field" filled v-model="data[fields[i].field]" :label="item.label" :type="item.type"/>
              </template>
            </q-card-section>
            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn label="Zapisz" type="submit" color="primary"/>
              <q-btn label="Anuluj" type="reset" color="primary" v-close-popup />
            </q-card-actions>
          </q-form>
        </q-btn-dropdown>
        <q-btn glossy icon="file_copy" dense no-caps label="Eksport" color="primary" @click="csv"/>
      </q-btn-group>
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
      filters: [],
      data: [],
      columns: [],
      title: ''
    }
  },
  watch: {
    '$route.params.id': {
      handler: function () {
        this.pagination = {
          sortBy: '',
          descending: false,
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 10
        }
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
    loadData (props) {
      if (typeof props !== 'undefined') {
        this.pagination = props.pagination
      }
      var q = ''
      var dir = 'asc'
      if (this.pagination.descending) {
        dir = 'desc'
      }
      if (this.pagination.sortBy) {
        q = `?q=(order_column:${this.pagination.sortBy},order_direction:${dir})`
      }
      axiosGet(this, this.model, 'data', `${this.model}/${q}`, this.loadCallback)
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
