<template>
  <div class="q-pa-md">
    <q-table
      @request="onRequest"
      @row-click="editRow"
      :title="defs.label"
      :columns="defs.columns"
      :data="rows"
      :loading="this.$apollo.queries.rows.loading"
      row-key="nodeId"
      separator="cell"
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      dense style="height: 103vh">
      <template v-slot:top-right>
        <q-btn-group>
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
        <q-td v-else-if="props.col.type=='icon'" :props="props">
          <q-icon v-if="props.value!=null" :name="props.value" style="font-size: 20px;" />
        </q-td>
        <q-td v-else :props="props">
          {{props.value}}
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { apolloTableDefsUpdate } from '../boot/ioia.js'
export default {
  apollo: {
    defs: {
      query: gql`query ($model: String!) {
        defs: sourceByName(name: $model) {
          label
          columns
        }
      }`,
      variables () {
        return {
          model: this.$route.params.model
        }
      },
      update (data) {
        return apolloTableDefsUpdate(this, data)
      },
      error (error) {
        this.alert = true
        this.error = error
      }
    },
    rows: {
      query () {
        return gql`query ($offset: Int!) {rows: ${this.query}}`
      },
      variables () {
        return {
          offset: this.pagination.offset,
          order: '[]'
        }
      },
      errorPolicy: 'all',
      update (data) {
        this.pagination.rowsNumber = data.rows.totalCount
        return data.rows.nodes
      },
      error (error) {
        this.alert = true
        this.error = error
      },
      skip () {
        return this.skipQuery
      }
    }
  },
  data () {
    return {
      totalCount: 0,
      defs: {},
      query: '',
      filter: '',
      filters: [],
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
      this.query = `${this.$route.params.model}s(first:${this.pagination.rowsPerPage}, offset: $offset, orderBy: ${this.order}) {nodes {nodeId${this.columns}} totalCount}`
      this.$apollo.queries.rows.refetch()
      this.pagination.first = fetchCount
      this.pagination.offset = startRow
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending
      this.loading = false
    },
    loadData () {
      this.$apollo.queries.rows.refetch()
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
    }
  }
}
</script>
