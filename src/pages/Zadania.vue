<template>
  <div class="q-pa-md">
    <q-table dense :data="data" :title="this.$route.params.id" :columns="columns" row-key="id" selection="multiple" :selected.sync="selected" :pagination.sync="pagination" >
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
            <q-checkbox v-model="props.row.gotowe" @input="toggleRow(props.key)" />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td auto-width>
            <q-btn size="sm" color="green" round dense @click="editRow(props.key)" icon="edit" />
            <q-btn size="sm" color="red" round dense @click="removeRow(props.key)" icon="remove" />
          </q-td>
        </q-tr>
      </template>
      <template v-slot:no-data="">
        <q-space />
        <q-btn dense color="primary" :disable="loading" label="Dodaj zadanie" @click="addRow" />
      </template>
      <template v-slot:bottom>
        <q-space />
        <q-btn dense color="primary" :disable="loading" label="Dodaj zadanie" @click="addRow" />
      </template>
    </q-table>
    <q-dialog v-model="popup" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Pozycja zamówienia ({{form_data.id}})</div>
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
  </div>
</template>

<script>
import { axiosGet, axiosDelete, axiosPut, axiosPost } from '../boot/ioia.js'
export default {
  data () {
    return {
      model: 'zadanie',
      selected: [],
      fields: [
        { name: 'data', label: 'Data', field: 'data', type: 'date' },
        { name: 'data_realizacji', label: 'Oczekiwana data realizacji', field: 'data_realizacji', type: 'date' },
        { name: 'zadanie', label: 'Zadanie', field: 'zadanie', type: 'text' },
        { name: 'odpowiedzialny', label: 'Osoba odpowiedzialna', field: 'odpowiedzialny', type: 'text' }
      ],
      columns: [
        { name: 'data', label: 'Data', align: 'left', field: 'data', sortable: true },
        { name: 'data_realizacji', label: 'Oczekiwana data realizacji', align: 'left', field: 'data_realizacji', sortable: true },
        { name: 'zadanie', label: 'Zadanie', align: 'left', field: 'zadanie', sortable: true },
        { name: 'odpowiedzialny', label: 'Osoba odpowiedzialna', align: 'left', field: 'odpowiedzialny', sortable: true }
      ],
      data: [],
      pagination: {
        rowsPerPage: 0
      },
      form_data: {},
      popup: false,
      loading: false
    }
  },
  mounted: function () {
    this.loadData()
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
    loadCallback (data) {
      this.title = data.list_title[0]
      this.data = data.result
      for (const id in data.ids) {
        this.data[id].id = data.ids[id]
      }
      this.pagination.rowsNumber = data.count
    },
    closeCallback () {
      this.loadData()
      this.popup = false
      this.loading = false
    },
    addRow () {
      this.form_data = this.data[this.data.push({ id: null, gotowe: false, kategoria: this.$route.params.id }) - 1]
      this.popup = true
    },
    editRow (id) {
      var i
      for (i = 0; i < this.data.length; i++) {
        if (this.data[i].id === id) this.form_data = this.data[i]
      }
      this.popup = true
    },
    removeRow (id) {
      axiosDelete(this, `${this.model}`, `${this.model}/${id}?filter=${this.$route.params.id}`, this.loadData)
    },
    saveRow () {
      this.loading = true
      if (this.form_data.id !== null) {
        var id = this.form_data.id
        delete this.form_data.id
        axiosPut(this, `${this.model}`, this.form_data, `${this.model}/${id}?filter=${this.$route.params.id}`, this.closeCallback)
      } else {
        delete this.form_data.id
        axiosPost(this, `${this.model}`, this.form_data, `${this.model}/?filter=${this.$route.params.id}`, this.closeCallback)
      }
    },
    toggleRow (id) {
      var i
      for (i = 0; i < this.data.length; i++) {
        if (this.data[i].id === id) this.form_data = this.data[i]
      }
      this.saveRow()
    },
    loadData () {
      axiosGet(this, `${this.model}`, null, `${this.model}/?filter=${this.$route.params.id}`, this.loadCallback)
    }
  }
}
</script>
