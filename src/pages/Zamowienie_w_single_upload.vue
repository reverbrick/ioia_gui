<template>
  <div class="q-pa-md">
    <q-form title="Dodaj zamówienie" @submit="onSubmit" class="q-gutter-md">
        <div class="bg-grey-2 q-pa-sm rounded-borders">
          Pozycje:
          <q-table dense :data="data.pozycje" :columns="columns" row-key="id" @row-click="editRow" :pagination.sync="pagination">
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
              <q-btn dense color="primary" :disable="loading" label="Dodaj pozycję" @click="addRow" />
            </template>
            <template v-slot:bottom>
              <q-space />
              <q-btn dense color="primary" :disable="loading" label="Dodaj pozycję" @click="addRow" />
            </template>
          </q-table>
        </div>
        <div class="bg-grey-2 q-pa-sm rounded-borders">
          Numer projektu:
          <q-option-group dense :options="op_nr_proj" label="Notifications" type="checkbox" v-model="data.projekt" />
        </div>
        <div class="bg-grey-2 q-pa-sm rounded-borders">
          Priorytet:
          <q-list>
            <q-item dense tag="label" v-ripple>
              <q-item-section avatar>
                <q-toggle color="blue" v-model="data.prio_termin" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Termin</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input filled dense v-model="data.uwagi_termin" label="Termin" :disable="!data.prio_termin" />
              </q-item-section>
            </q-item>
            <q-item dense tag="label" v-ripple>
              <q-item-section avatar>
                <q-toggle color="blue" v-model="data.prio_cena" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Cena</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input filled dense v-model="data.uwagi_cena" label="Cena" :disable="!data.prio_cena" />
              </q-item-section>
            </q-item>
            <q-item dense tag="label" v-ripple>
              <q-item-section avatar>
                <q-toggle color="blue" v-model="data.prio_jakosc" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Jakość</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-input filled dense v-model="data.uwagi_jakosc" label="Jakość" :disable="!data.prio_jakosc" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="bg-grey-2 q-pa-sm rounded-borders">
          Załącznik:
          <q-input dense :prefix="data.zalacznik" name="zalacznik" filled type="file" hint="Dodaj plik" />
        </div>
        <div class="bg-grey-2 q-pa-sm rounded-borders">
          Uwagi:
          <q-input v-model="data.uwagi" filled dense clearable autogrow hint="Podaj uwagi do zamówienia" />
        </div>
        <div class="bg-grey-2 q-pa-sm rounded-borders">
          Dostarczono:
          <q-toggle color="blue" v-model="data.dostarczono" />
        </div>
      <q-footer class="bg-white">
        <q-toolbar class="bg-white text-primary q-gutter-sm">
          <q-btn label="Zapisz" type="submit" color="primary"/>
          <q-btn label="Usuń" @click="remove" color="negative"/>
          <q-btn label="Anuluj" @click="goBack" color="primary" flat class="q-ml-sm" />
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
              <q-input dense v-bind:key="item.field" :type="item.type" :required="item.required" v-for="(item, i) in fields" filled v-model="form_data[fields[i].field]" :label="item.label" />
            </q-card-section>
            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn dense label="Zamknij" type="submit" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
    </q-form>
  </div>
</template>

<script>
import { axiosGet, axiosPut, axiosPost, axiosDelete, axiosError } from '../boot/ioia.js'
export default {
  data () {
    return {
      file: null,
      files: null,
      submitEmpty: false,
      submitResult: [],
      data: {
        projekt: [],
        pozycje: []
      },
      // pozycje: [],
      fields: [
        { name: 'produkt', label: 'Produkt *', field: 'produkt', required: true, type: 'text' },
        { name: 'producent', label: 'Producent *', field: 'producent', required: true, type: 'text' },
        { name: 'link', label: 'Link', field: 'link', type: 'text' },
        { name: 'ilosc', label: 'Ilość *', field: 'ilosc', required: true, type: 'number' }
      ],
      columns: [
        { name: 'id', label: 'Lp', field: 'id', sortable: false, align: 'left' },
        { name: 'produkt', label: 'Produkt', field: 'produkt', sortable: false, align: 'left' },
        { name: 'producent', label: 'Producent', field: 'producent', sortable: false, align: 'left' },
        { name: 'link', label: 'Link', field: 'link', sortable: false, align: 'left' },
        { name: 'ilosc', label: 'Ilość', field: 'ilosc', sortable: false, align: 'left' }
      ],
      op_nr_proj: [],
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
    goBack () {
      this.$emit('loadData')
      this.$router.push('/list/zamowienie')
      return 0
    },
    addRow () {
      this.form_data = this.data.pozycje[this.data.pozycje.push({ id: 'new_' + this.data.pozycje.length }) - 1]
      this.popup = true
    },
    editRow (id) {
      // this.form_data = row
      for (var i = 0; i < this.data.pozycje.length; i++) {
        if (this.data.pozycje[i].id === id) {
          this.form_data = this.data.pozycje[i]
          if (String(this.data.pozycje[i].id).substr(0, 4) !== 'new_') {
            this.form_data.id = 'new_' + this.form_data.id
          }
          delete this.form_data.created_on
          delete this.form_data.changed_on
        }
      }
      this.popup = true
    },
    removeRow (id) {
      for (var i = 0; i < this.data.pozycje.length; i++) {
        if (this.data.pozycje[i].id === id) this.data.pozycje.splice(i, 1)
      }
    },
    onSubmit (evt) {
      this.loading = true
      // upload
      const formData = new FormData(evt.target)
      this.$axios.post(`${this.api_link}/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        if (response.data.name) {
          this.data.zalacznik = response.data.name
        }
        // save form
        for (var i = 0; i < this.data.pozycje.length; i++) {
          if (String(this.data.pozycje[i].id).substr(0, 4) === 'new_') {
            delete this.data.pozycje[i].id
          }
        }
        if (this.$route.params.id !== '0') {
          axiosPut(this, 'Zamówienie', this.data, `zamowienie/${this.$route.params.id}`, this.goBack())
        } else {
          axiosPost(this, 'Zamówienie', this.data, 'zamowienie/', this.goBack())
        }
      })
        .catch(() => {
          axiosError(this, 'Wystąpił błąd przy ładowaniu pliku!', 'negative')
          this.loading = false
        })
    },
    onSubmit2 () {
      this.popup = false
    },
    upload (files) {
      const zalacznik = this.$refs.zalacznik
      // zalacznik.files = zalacznik.files.concat(files)
      zalacznik.upload()
    },
    remove () {
      axiosDelete(this, 'Zamówienie', `zamowienie/${this.$route.params.id}`, this.goBack)
    },
    loadData (props) {
      // project list
      axiosGet(this, 'Projekty', 'op_nr_proj', 'projekt?q=(keys:!(none))&format=zamowienie')
      // populate form
      if (this.$route.params.id !== '0') {
        axiosGet(this, 'Zamówienie', 'data', `zamowienie/${this.$route.params.id}?q=(keys:!(none))`)
      }
      // populate items
      // axiosGet(this, 'Pozycje zamówienia', 'pozycje', `zamowienie_poz/?filter=${this.$route.params.id}&q=(keys:!(none))`)
    }
  }
}
</script>
