<template>
  <div class="q-pa-md">
    <q-form title="Dodaj zamówienie" @submit="onSubmit" class="q-gutter-md">
        <div class="bg-grey-2 q-pa-sm rounded-borders">
          Dostarczono:
          <q-toggle color="blue" v-model="data.shipped" />
        </div>
        <div class="bg-grey-2 q-pa-sm rounded-borders">
          Pozycje:
          <q-table dense :data="data.lines" :columns="columns" row-key="id" @row-click="editRow" :pagination.sync="pagination">
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props" >
                  {{ col.label }}
                </q-th>
                <q-th auto-width />
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
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
              <q-btn glossy icon="note_add" dense no-caps label="Dodaj" color="primary" :disable="loading" @click="addRow" />
            </template>
            <template v-slot:bottom>
              <q-space />
              <q-btn glossy icon="note_add" dense no-caps label="Dodaj" color="primary" :disable="loading" @click="addRow" />
            </template>
          </q-table>
        </div>
        <div class="bg-grey-2 q-pa-sm rounded-borders">
          Numer projektu:
          <q-option-group dense :options="op_nr_proj" label="Notifications" type="checkbox" v-model="data.projects" />
        </div>
        <div class="bg-grey-2 q-pa-sm rounded-borders">
          Priorytet:
          <q-list>
            <q-item dense tag="label" v-ripple>
              <q-item-section avatar>
                <q-toggle color="blue" v-model="data.flagDate" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Termin</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input filled dense v-model="data.notesDate" label="Termin" :disable="!data.flagDate" />
              </q-item-section>
            </q-item>
            <q-item dense tag="label" v-ripple>
              <q-item-section avatar>
                <q-toggle color="blue" v-model="data.flagPrice" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Cena</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input filled dense v-model="data.notesPrice" label="Cena" :disable="!data.flagPrice" />
              </q-item-section>
            </q-item>
            <q-item dense tag="label" v-ripple>
              <q-item-section avatar>
                <q-toggle color="blue" v-model="data.flagQuality" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Jakość</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input filled dense v-model="data.notesQuality" label="Jakość" :disable="!data.flagQuality" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <Attachment label="Załączniki" max="3" model="zamowienie" :id="$route.params.id" :list="data.zalacznik" />
        <div class="bg-grey-2 q-pa-sm rounded-borders">
          Uwagi:
          <q-input v-model="data.notes" filled dense clearable autogrow hint="Podaj uwagi do zamówienia" />
        </div>
        <div class="bg-grey-2 q-pa-sm rounded-borders">
          Dostarczono:
          <q-toggle color="blue" v-model="data.dostarczono" />
        </div>
      <q-footer class="bg-white">
        <q-toolbar class="bg-white text-primary q-gutter-sm">
          <q-btn label="Zapisz" type="submit" color="positive"/>
          <q-btn label="Usuń" @click="remove" color="negative"/>
          <q-btn label="Anuluj" @click="goBack" color="primary"/>
        </q-toolbar>
        <br/>
      </q-footer>
      <q-dialog v-model="popup" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6">Pozycja zamówienia ({{form_data.id}})</div>
          </q-card-section>
          <q-form @submit="onSubmit2" class="q-gutter-md">
            <q-card-section class="q-pt-none q-gutter-md">
              <template v-for="(item, i) in fields">
                <q-toggle v-if="item.type=='boolean'" stack-label :required="item.required" v-bind:key="item.field" v-model="form_data[fields[i].field]" :label="item.label" :type="item.type"/>
                <q-select v-if="item.type=='select'" emit-value map-options dense filled :required="item.required" v-bind:key="item.field" v-model="form_data[fields[i].field]" :options="op_jm" :label="item.label" :type="item.type"/>
                <!--<q-input v-else stack-label :required="item.required" v-bind:key="item.field" filled v-model="data[fields[i].field]" :label="item.label" :type="item.type"/>-->
                <q-input v-else dense v-bind:key="item.field" :type="item.type" :required="item.required" filled v-model="form_data[fields[i].field]" :label="item.label" />
              </template>
            </q-card-section>
            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn dense label="Zamknij" type="submit" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
    </q-form>
    <Error ref="err"/>
  </div>
</template>

<script>
import { apolloCreate, apolloUpdate, apolloDelete, apolloQuery } from '../boot/ioia.js'
import Attachment from 'components/Attachment'
import Error from 'components/Error'
export default {
  components: {
    Attachment,
    Error
  },
  data () {
    return {
      data: {
        projects: [],
        lines: []
      },
      projects: [],
      // pozycje: [],
      fields: [
        { name: 'produkt', label: 'Produkt *', field: 'produkt', required: true, type: 'text' },
        { name: 'producent', label: 'Producent *', field: 'producent', required: true, type: 'text' },
        { name: 'link', label: 'Link', field: 'link', type: 'text' },
        { name: 'ilosc', label: 'Ilość *', field: 'ilosc', required: true, type: 'number' },
        { name: 'jm', label: 'JM', field: 'jm_id', required: false, type: 'select' }
      ],
      columns: [
        { name: 'id', label: 'Lp', field: 'id', sortable: false, align: 'left' },
        { name: 'produkt', label: 'Produkt', field: 'produkt', sortable: false, align: 'left' },
        { name: 'producent', label: 'Producent', field: 'producent', sortable: false, align: 'left' },
        { name: 'link', label: 'Link', field: 'link', sortable: false, align: 'left' },
        { name: 'ilosc', label: 'Ilość', field: 'ilosc', sortable: false, align: 'left' }
        // { name: 'jm', label: 'JM', field: 'jm', sortable: false, align: 'left' }
      ],
      op_nr_proj: [],
      op_jm: [],
      op_priorytet: [
        { label: 'Termin', value: 'termin' },
        { label: 'Cena', value: 'cena' },
        { label: 'Jakosc', value: 'jakosc' }
      ],
      form_data: {},
      pagination: {
        rowsPerPage: 0
      },
      popup: false,
      loading: false
    }
  },
  mounted: function () {
    this.loadData()
  },
  methods: {
    submitCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Formularz')
      } else {
        this.$emit('loadData')
        this.$router.push('/table_route/order')
      }
    },
    goBack () {
      this.$emit('loadData')
      this.$router.push('/table_route/order')
      return 0
    },
    addRow () {
      this.form_data = this.data.lines[this.data.lines.push({ id: 'new_' + this.data.lines.length }) - 1]
      this.popup = true
    },
    editRow (id) {
      // this.form_data = row
      for (var i = 0; i < this.data.lines.length; i++) {
        if (this.data.lines[i].id === id) {
          this.form_data = this.data.lines[i]
          if (String(this.data.lines[i].id).substr(0, 4) !== 'new_') {
            this.form_data.id = 'new_' + this.form_data.id
          }
          delete this.form_data.created_on
          delete this.form_data.changed_on
        }
      }
      this.popup = true
    },
    removeRow (id) {
      for (var i = 0; i < this.data.lines.length; i++) {
        if (this.data.lines[i].id === id) this.data.lines.splice(i, 1)
      }
    },
    onSubmit (evt) {
      this.loading = true
      for (var i = 0; i < this.data.lines.length; i++) {
        this.data.lines[i].id = i + 1
      }
      delete this.data.zalacznik
      if (this.$route.params.id !== 'new') {
        // axiosPut(this, 'Zamówienie', this.data, `zamowienie/${this.$route.params.id}`, this.goBack)
        apolloUpdate('order', this.$route.params.id, this.data, this.submitCallback)
      } else {
        // axiosPost(this, 'Zamówienie', this.data, 'zamowienie/', this.goBack)
        apolloCreate('order', this.data, this.submitCallback)
      }
    },
    onSubmit2 () {
      this.popup = false
    },
    remove () {
      this.$q.dialog({
        title: 'Potwierdzenie',
        message: 'Czy na pewno chcesz usunąć element Zamówienie?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        apolloDelete('order', this.$route.params.id, this.submitCallback)
      })
    },
    loadData (props) {
      this.loading = true
      this.$root.$children[0].$children[0].breadcrumbs = [
        { label: 'Strona główna', icon: 'home', to: '/' },
        { label: 'Zamówienia', icon: undefined, click: '' }
      ]
      // project, jm list
      apolloQuery(
        `query {
          projects {
            nodes {
              value: id
              label: name
            }
          }
          uoms {
            nodes {
              value: id
              label: name
            }
          }
        }`,
        {},
        this.listUpdateCallback
      )
      // populate form
      if (this.$route.params.id !== 'new') {
        apolloQuery(
          `query ($id: ID!){
            orderByNodeId(nodeId: $id) {
              shipped
              flagDate
              flagPrice
              flagQuality
              notesDate
              notesPrice
              notesQuality
              notes
              projects
              lines
            }
          }`,
          {
            id: this.$route.params.id
          },
          this.dataUpdateCallback
        )
      }
      // populate items
      // axiosGet(this, 'Pozycje zamówienia', 'pozycje', `zamowienie_poz/?filter=${this.$route.params.id}&q=(keys:!(none))`)
    },
    listUpdateCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Zamówienie-listy')
      } else {
        data = data.data
        this.op_nr_proj = data.projects.nodes
        this.op_jm = data.uoms.nodes
      }
      this.loading = false
    },
    dataUpdateCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Zamówienie')
      } else {
        data = data.data
        this.data = data.orderByNodeId
      }
      this.loading = false
    }
  }
}
</script>
