<template>
  <div class="q-pa-md">
    <q-table dense :data="data" :title="this.$route.params.id" :columns="columns" row-key="nodeId" selection="multiple" :selected.sync="selected" :pagination.sync="pagination" >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props" >
            {{ col.label }}
          </q-th>
          <q-th auto-width />
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox :disable="locked" v-model="props.row.done" @input="toggleRow(props.key)" />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td auto-width>
            <q-btn size="sm" color="green" round dense @click="editRow(props.key)" icon="edit" :disable="locked" />
            <q-btn size="sm" color="red" round dense @click="removeRow(props.key)" icon="remove" :disable="locked" />
          </q-td>
        </q-tr>
      </template>
      <template v-slot:no-data="">
        <q-space />
        <q-btn dense color="primary" label="Dodaj zadanie" @click="addRow" :disable="locked" />
      </template>
      <template v-slot:bottom>
        <q-space />
        <q-btn dense color="primary" label="Dodaj zadanie" @click="addRow" :disable="locked" />
      </template>
    </q-table>
    <q-dialog v-model="popup" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Zadanie</div>
        </q-card-section>
        <q-form class="q-gutter-md">
          <q-card-section class="q-pt-none">
            <q-input dense stack-label v-bind:key="item.field" v-for="(item, i) in fields" filled :type="item.type" v-model="form_data[fields[i].field]" :label="item.label" lazy-rules :rules="[val => val !== null && val !== '' || 'Required field!']"/>
          </q-card-section>
          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn dense label="Zamknij" type="reset" color="primary" @click="saveRow" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <Error ref="err"/>
  </div>
</template>

<script>
import { apolloQuery, apolloCreate, apolloUpdate, apolloDelete } from '../boot/ioia.js'
import Error from 'components/Error'
import { date } from 'quasar'
export default {
  components: {
    Error
  },
  data () {
    return {
      model: 'task',
      selected: [],
      fields: [
        { name: 'data', label: 'Data', field: 'taskDate', type: 'date' },
        { name: 'data_realizacji', label: 'Oczekiwana data realizacji', field: 'dueDate', type: 'date' },
        { name: 'zadanie', label: 'Zadanie', field: 'task', type: 'text' },
        { name: 'odpowiedzialny', label: 'Osoba odpowiedzialna', field: 'person', type: 'text' }
      ],
      columns: [
        { name: 'data', label: 'Data', align: 'left', field: 'taskDate', sortable: true },
        { name: 'data_realizacji', label: 'Oczekiwana data realizacji', align: 'left', field: 'dueDate', sortable: true },
        { name: 'zadanie', label: 'Zadanie', align: 'left', field: 'task', sortable: true },
        { name: 'odpowiedzialny', label: 'Osoba odpowiedzialna', align: 'left', field: 'person', sortable: true }
      ],
      data: [],
      pagination: {
        rowsPerPage: 0
      },
      form_data: {},
      popup: false,
      loading: false,
      locked: true
    }
  },
  mounted: function () {
    this.loadData()
  },
  watch: {
    $route: {
      handler: function () {
        if (this.$route.params.id === 'Metalwit' && this.$parent.$parent.$parent.$refs.branding.app !== 'Metalwit') {
          // this.locked = true
          this.locked = false
        } else {
          this.locked = false
        }
        this.loadData()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    closeCallback () {
      this.loadData()
      this.popup = false
      this.loading = false
    },
    addRow () {
      this.form_data = this.data[this.data.push({ nodeId: null, done: false, category: this.$route.params.id, project: this.$route.params.app }) - 1]
      this.popup = true
    },
    editRow (id) {
      var i
      for (i = 0; i < this.data.length; i++) {
        if (this.data[i].nodeId === id) this.form_data = this.data[i]
      }
      this.popup = true
    },
    removeRow (id) {
      apolloDelete(this.model, id, this.submitCallback)
    },
    saveRow () {
      this.loading = true
      if (this.form_data.nodeId !== null) { // existing
        var id = this.form_data.nodeId
        delete this.form_data.nodeId
        apolloUpdate(this.model, id, this.form_data, this.submitCallback)
        this.form_data.nodeId = id
      } else { // new
        delete this.form_data.nodeId
        apolloCreate(this.model, this.form_data, this.submitCallback)
      }
    },
    toggleRow (id) {
      var i
      for (i = 0; i < this.data.length; i++) {
        if (this.data[i].nodeId === id) this.form_data = this.data[i]
      }
      this.saveRow()
    },
    loadData () {
      this.$root.$children[0].$children[0].breadcrumbs = [{ label: 'Strona główna', icon: 'home', to: '/' }]
      if (this.$route.params.app) this.$root.$children[0].$children[0].breadcrumbs.push({ label: this.$route.params.app, icon: undefined, click: '' })
      this.$root.$children[0].$children[0].breadcrumbs.push({ label: 'Zadania', icon: undefined, click: '' })
      this.$root.$children[0].$children[0].breadcrumbs.push({ label: this.$route.params.id, icon: undefined, click: '' })
      this.loading = true
      apolloQuery(
        `query ($category: String!, $project: String!) {
          tasks(filter: {category: {equalTo: $category}, project: {equalTo: $project}}) {
            nodes {
              nodeId
              taskDate
              dueDate
              done
              task
              person
              project
              category
            }
          }
        }`,
        {
          category: this.$route.params.id,
          project: this.$route.params.app
        },
        this.dataUpdateCallback
      )
    },
    dataUpdateCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Zadania')
      } else {
        for (var i = 0; i < data.data.tasks.nodes.length; i++) {
          data.data.tasks.nodes[i].dueDate = this.date_format(data.data.tasks.nodes[i].dueDate)
          data.data.tasks.nodes[i].taskDate = this.date_format(data.data.tasks.nodes[i].taskDate)
        }
        this.data = data.data.tasks.nodes
      }
      this.loading = false
    },
    date_format (val) {
      if (val) return date.formatDate(val, 'YYYY-MM-DD')
    },
    submitCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Formularz')
      }
      this.loadData()
      this.popup = false
      this.loading = false
    }
  }
}
</script>
