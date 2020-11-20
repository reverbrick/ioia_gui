<template>
  <div class="q-pa-md">
    <q-table
      @request="onRequest"
      @row-dblclick="editRow"
      @row-click="showDetails"
      :title="defs.label"
      :columns="defs.columns"
      :data="rows"
      row-key="nodeId"
      separator="cell"
      :visible-columns="visible"
      :pagination.sync="pagination"
      selection="none"
      :selected.sync="selected"
      :rows-per-page-options="[0]"
      :class="tclass"
      dense>
      <template v-slot:top-right>
        <q-btn-group>
          <!--
          <q-filter-configurator v-bind="filters_config" v-model="filters">
            <template #slot_filter_select="{ copy, label, multiple, options }">
              <q-item>
                <q-item-section>
                  <q-select emit-value map-options dense borderless :label="label" :multiple="multiple" :options="options" v-model="copy.slot_filter_select" />
                </q-item-section>
              </q-item>
            </template>
          </q-filter-configurator>
          -->
          <q-btn v-if="$route.meta.title=='Edycja'" glossy icon="note_add" dense no-caps label="Dodaj" color="primary" @click="editRow" />
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
      <template v-slot:body-cell="props">
        <q-td v-if="props.col.type=='check'" :props="props">
          <q-icon v-if="props.value==true" name="check_circle" color="green" style="font-size: 20px;" />
        </q-td>
        <q-td v-else-if="props.col.type=='related_name'" :props="props">
          {{check_null_name(props.value)}}
        </q-td>
        <q-td v-else-if="props.col.type=='icon'" :props="props">
          <q-icon v-if="props.value!=null" :name="props.value" style="font-size: 20px;" />
        </q-td>
        <q-td v-else :props="props">
          {{props.value}}
        </q-td>
      </template>
    </q-table>
    <Error ref="err"/>
  </div>
</template>

<script>
import { apolloDefs, apolloQuery } from '../boot/ioia.js'
import VuePluralize from 'vue-pluralize'
import Vue from 'vue'
import Error from 'components/Error'

Vue.use(VuePluralize)

export default {
  components: {
    Error
  },
  props: {
    tclass: { default: 'sticky-header' }
  },
  mounted () {
    this.loadData()
  },
  watch: {
    $route: function (newVal) {
      this.loadData()
    }
  },
  data () {
    return {
      visible: [],
      selected: [],
      filters: {},
      filters_config: {
        color: 'blue',
        placeholder: 'Dodaj filtry',
        uppercase: false,
        reverse: false,
        showNodeLabel: true,
        showNodeIcon: false,
        nodes: [
          {
            label: 'General',
            icon: 'mdi-tune-vertical',
            filters: [
              { label: 'When', model: 'created', date: true },
              {
                label: 'Provenience',
                model: 'provenience_ids',
                multiple: true,
                options: [
                  { label: 'Leaflet', value: 2 },
                  { label: 'Advertising', value: 3 },
                  { label: 'Tv', value: 4 },
                  { label: 'Social', value: 5 },
                  { label: 'Web Site', value: 6 }
                ]
              },
              { label: 'Slot Filter', model: 'slot_filter', options: [] },
              {
                label: 'Select slot example',
                model: 'slot_filter_select',
                multiple: true,
                options: [
                  { label: 'One', value: 1 },
                  { label: 'Two', value: 2 }
                ]
              }
            ]
          }
        ]
      },
      totalCount: 0,
      defs: {},
      rows: [],
      query: '',
      filter: '',
      // filters: [],
      order: '[]',
      columns: '',
      pagination: {
        offset: 0,
        first: 10,
        rowsPerPage: 50,
        rowsNumber: 0
      }
    }
  },
  methods: {
    check_null_name (val) {
      if (val) return val.name
    },
    onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      this.loading = true
      const fetchCount = rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage
      const startRow = (page - 1) * rowsPerPage
      if (sortBy !== null) {
        if (descending) {
          this.order = `[${sortBy}_DESC]`
        } else {
          this.order = `[${sortBy}_ASC]`
        }
      } else {
        this.order = '[]'
      }
      this.query = `${this.$pluralize(this.$route.params.model)}(first:${this.pagination.rowsPerPage}, offset: $offset, orderBy: ${this.order}) {nodes {nodeId${this.columns}} totalCount}`
      apolloQuery(
        `query ($offset: Int!) {rows: ${this.query}}`,
        {
          offset: startRow
        },
        this.dataUpdateCallback
      )
      this.pagination.first = fetchCount
      this.pagination.offset = startRow
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending
      this.loading = false
    },
    loadData () {
      apolloDefs(this.$route.params.model, this.defsUpdateCallback)
    },
    defsUpdateCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Tabela')
      } else {
        data = data.data
        this.defs = data.defs
        if (data.defs.columns) {
          var columns = ''
          var visible = []
          data.defs.columns.forEach(function (col) {
            if (col.type === 'related_name') columns = columns + ` ${col.field} {name}`
            else columns = columns + ` ${col.field}`
            if (!col.hidden) visible.push(col.name)
          })
          this.query = `${this.$pluralize(this.$route.params.model)}(first:${this.pagination.rowsPerPage}, offset: $offset, orderBy: ${this.order}) {nodes {nodeId${columns}} totalCount}`
          this.columns = columns
          this.visible = visible
          this.order = '[]'
          apolloQuery(
            `query ($offset: Int!) {rows: ${this.query}}`,
            {
              offset: this.pagination.offset,
              order: '[]'
            },
            this.dataUpdateCallback
          )
        } else {
          this.defs.columns = []
        }
      }
    },
    dataUpdateCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Tabela')
      } else {
        data = data.data
        this.rows = data.rows.nodes
        this.pagination.rowsNumber = data.rows.totalCount
      }
    },
    showDetails (evt, row, index) {
      this.selected = [row]
      this.$emit('showDetails', row, this.defs.columns)
    },
    editRow (evt, row, index) {
      if (index !== undefined) {
        this.$emit('editRow', row.nodeId) // existing
      } else {
        this.$emit('editRow', undefined) // new
      }
    },
    csv () {
      this.$q.notify({
        message: 'Export',
        color: 'info'
      })
    },
    resetSearch () {
      this.filter = ''
      this.$refs.search.focus()
    },
    saveConfiguration () {
      this.$q.notify({
        message: 'Filters configurations saved successfully',
        caption: 'example',
        color: this.$q.dark.isActive ? 'dark' : 'primary',
        icon: 'mdi-content-copy'
      })
    }
  }
}
</script>
