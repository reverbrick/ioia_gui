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
      dense style="height: 400px">
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
      <template v-slot:body-cell="props">
        <q-td v-if="props.value=='#check#'" :props="props">
          <q-icon name="check_circle" color="green" style="font-size: 20px;" />
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
        if (data.defs !== null) {
          if (data.defs.columns) {
            var columns = ''
            data.defs.columns.forEach(function (col) {
              columns = columns + ` ${col.field}`
            })
            this.query = `${this.$route.params.model}s(first:${this.pagination.rowsPerPage}, offset: $offset) {nodes {nodeId${columns}} totalCount}`
            this.$nextTick(() => { this.$apollo.queries.rows.skip = false })
          } else {
            data.defs.columns = []
          }
        } else {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: `Wystąpił błąd przy ładowaniu definicji elementu ${this.$route.params.model}!`,
            caption: 'Nie znaleziono elementu.',
            icon: 'report_problem'
          })
        }
        return data.defs
      },
      error (error) {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: `Wystąpił błąd przy ładowaniu definicji elementu ${this.$route.params.model}!`,
          caption: error.toString(),
          icon: 'report_problem'
        })
      }
    },
    rows: {
      query () {
        return gql`query ($offset: Int!) {rows: ${this.query}}`
      },
      variables () {
        return {
          offset: this.pagination.offset
        }
      },
      update (data) {
        this.pagination.rowsNumber = data.rows.totalCount
        return data.rows.nodes
      },
      error (error) {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: `Wystąpił błąd przy ładowaniu elementu ${this.$route.params.model}!`,
          caption: error.toString(),
          icon: 'report_problem'
        })
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
      pagination: {
        offset: 0,
        first: 10,
        rowsPerPage: 20,
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
      this.pagination.first = fetchCount
      this.pagination.offset = startRow
      this.$apollo.queries.rows.refetch()
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
      this.$emit('editRow', row.nodeId)
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
