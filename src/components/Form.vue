<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
    </q-card-section>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-card-section class="q-pt-none q-gutter-md">
        <template v-for="(item, i) in fields">
          <q-toggle v-if="item.type=='boolean'" stack-label :required="item.required" v-bind:key="item.field" v-model="data[fields[i].field]" :label="item.label" :type="item.type"/>
          <q-input v-else stack-label :required="item.required" v-bind:key="item.field" filled v-model="data[fields[i].field]" :label="item.label" :type="item.type"/>
        </template>
        <Attachment v-if="data.zalacznik_" ref="zalacznik" label="Załączniki" max="3" :model="model" :id="id" :list="data.zalacznik" />
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn label="Zapisz" type="submit" color="positive"/>
        <q-btn label="Usuń" @click="remove" color="negative"/>
        <q-btn label="Anuluj" type="reset" color="primary" v-close-popup />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { axiosGet, axiosDelete, axiosPut, axiosPost } from '../boot/ioia.js'
import Attachment from 'components/Attachment'
export default {
  components: {
    Attachment
  },
  props: ['model'],
  data () {
    return {
      title: '',
      id: 'null',
      data: {},
      fields: [],
      upload_url: ''
    }
  },
  methods: {
    fType (text) {
      var map = {
        Date: 'date',
        Integer: 'number',
        Boolean: 'boolean'
      }
      if (map[text]) {
        return map[text]
      } else {
        return 'text'
      }
    },
    loadInfoCallback (data) {
      this.title = data.edit_title
      for (const col in data.edit_columns) {
        if (data.add_columns[col].name !== 'app') {
          this.fields.push({
            label: data.edit_columns[col].required ? data.edit_columns[col].label + ' *' : data.edit_columns[col].label,
            field: data.edit_columns[col].name,
            required: data.edit_columns[col].required,
            type: this.fType(data.edit_columns[col].type)
          })
        }
      }
    },
    loadInfoNewCallback (data) {
      this.title = data.add_title
      for (const col in data.add_columns) {
        if (data.add_columns[col].name !== 'app') {
          this.fields.push({
            label: data.add_columns[col].required ? data.add_columns[col].label + ' *' : data.add_columns[col].label,
            field: data.add_columns[col].name,
            required: data.add_columns[col].required,
            type: this.fType(data.add_columns[col].type)
          })
        }
      }
    },
    loadDataCallback () {
    },
    closeCallback () {
      this.$emit('loadData')
      this.$emit('openPopup', false)
    },
    loadForm (id) {
      this.id = id
      this.loading = true
      if (id !== '0') {
        axiosGet(this, `${this.model} info`, null, `${this.model}/_info`, this.loadInfoCallback, this.closeCallback)
        axiosGet(this, `${this.model}`, 'data', `${this.model}/${id}`, this.loadDataCallback, this.closeCallback)
      } else {
        axiosGet(this, `${this.model} info`, null, `${this.model}/_info`, this.loadInfoNewCallback, this.closeCallback)
      }
    },
    remove () {
      axiosDelete(this, `${this.model}`, `${this.model}/${this.id}`, this.closeCallback)
    },
    onSubmit () {
      this.loading = true
      delete this.data.zalacznik_
      if (this.id !== '0') {
        axiosPut(this, `${this.model}`, this.data, `${this.model}/${this.id}`, this.closeCallback)
      } else {
        axiosPost(this, `${this.model}`, this.data, `${this.model}/`, this.closeCallback)
      }
    },
    onReset () {
    }
  }
}
</script>
