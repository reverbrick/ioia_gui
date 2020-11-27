<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{label}}</div>
    </q-card-section>
    <q-form autofocus @submit="onSubmit" class="q-gutter-md" :loading="loading">
      <q-card-section class="q-pt-none q-gutter-md">
        <q-spinner
          v-if="loading"
          color="primary"
          size="3em"
        />
        <template v-for="(item, i) in fields">
          <!--BOOLEAN-->
          <q-toggle dense v-if="item.type=='boolean'" stack-label :required="item.required" v-bind:key="item.field" v-model="data[fields[i].field]" :label="item.label" :type="item.type"/>
          <!--TIME-->
          <q-input dense v-else-if="item.type=='time'" filled stack-label :required="item.required" v-bind:key="item.field" v-model="data[fields[i].field]" :label="item.label" mask="time" :rules="['time']">
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="data[fields[i].field]">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Zamknij" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <!--SELECT-->
          <q-select dense v-else-if="item.type=='select'" stack-label emit-value map-options :options="options[fields[i].model]" :required="item.required" v-bind:key="item.field" filled v-model="data[fields[i].field]" :label="item.label" :type="item.type"/>
          <!--JSON NODE-->
          <JsonNode v-else-if="item.type=='json_node'" v-bind:key="item.field" :title="item.label" :data="data[fields[i].field]" :model="item.field" @update-node="updateNode"/>
          <!--NUMBER-->
          <q-input dense v-else-if="item.type=='number'" stack-label :required="item.required" v-bind:key="item.field" filled v-model.number="data[fields[i].field]" :label="item.label" :type="item.type"/>
          <!--TEXT-->
          <q-input dense v-else stack-label :required="item.required" v-bind:key="item.field" filled v-model="data[fields[i].field]" :label="item.label" :type="item.type"/>
        </template>
        <!--<Attachment v-if="data.zalacznik_" ref="zalacznik" label="Załączniki" max="3" :model="model" :id="id" :list="data.zalacznik" />-->
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn label="Zapisz" type="submit" color="positive"/>
        <q-btn label="Usuń" @click="remove" color="negative"/>
        <q-btn label="Anuluj" @click="cancel" color="primary" v-close-popup />
      </q-card-actions>
    </q-form>
    <Error ref="err"/>
  </q-card>
</template>

<script>
// import Attachment from 'components/Attachment'
// import gql from 'graphql-tag'
import JsonNode from 'components/JsonNode'
import { apolloCreate, apolloUpdate, apolloDelete, apolloQuery, apolloDefs } from '../boot/ioia.js'
import Error from 'components/Error'
export default {
  components: {
    // Attachment
    JsonNode,
    Error
  },
  props: ['model'],
  data () {
    return {
      data: {},
      label: '',
      id: undefined,
      fields: [],
      upload_url: '',
      options: {},
      loading: true
    }
  },
  methods: {
    loadForm (id) {
      this.loading = true
      this.id = id
      apolloDefs(this.$route.params.model, this.defsUpdateCallback)
    },
    defsUpdateCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Formularz')
      } else {
        data = data.data
        this.label = data.defs.label
        if (data.defs !== null) {
          if (data.defs.fields) {
            this.fields = data.defs.fields
            var fields = ''
            var subquery = ''
            data.defs.fields.forEach(function (col) {
              fields = fields + ` ${col.field}`
              if (col.type === 'select') subquery = subquery + `${col.model}: ${col.model} {nodes {id name}}`
            })
            if (this.id) { // existing
              apolloQuery(
                `query ($id: ID!) {data: ${this.$route.params.model}ByNodeId(nodeId: $id) {${fields}}${subquery}}`,
                {
                  id: this.id
                },
                this.dataUpdateCallback
              )
            } else { // new
              if (subquery !== '') {
                apolloQuery(
                  `query {${subquery}}`,
                  {},
                  this.selectsUpdateCallback
                )
              } else {
                this.loading = false
              }
            }
          }
        }
      }
    },
    dataUpdateCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Formularz')
      } else {
        data = data.data
        this.data = data.data
        // populate options for Select
        for (const [key, value] of Object.entries(data)) {
          if (key !== 'data') {
            var options = []
            value.nodes.forEach(function (opt) {
              options.push({ label: opt.name, value: opt.id })
            })
            this.options[key] = options
          }
        }
      }
      this.loading = false
    },
    selectsUpdateCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Formularz')
      } else {
        data = data.data
        // populate options for Select
        for (const [key, value] of Object.entries(data)) {
          if (key !== 'data') {
            var options = []
            value.nodes.forEach(function (opt) {
              options.push({ label: opt.name, value: opt.id })
            })
            this.options[key] = options
          }
        }
      }
      this.loading = false
    },
    submitCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Formularz')
      } else {
        this.$emit('loadData')
        this.$emit('openPopup', false)
      }
    },
    remove () {
      this.$q.dialog({
        title: 'Potwierdzenie',
        message: `Czy na pewno chcesz usunąć element ${this.$route.params.model}?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        apolloDelete(this.$route.params.model, this.id, this.submitCallback)
      })
    },
    cancel () {
    },
    onSubmit () {
      if (this.id) { // existing
        apolloUpdate(this.$route.params.model, this.id, this.data, this.submitCallback)
      } else { // new
        apolloCreate(this.$route.params.model, this.data, this.submitCallback)
      }
    },
    updateNode (model, val) {
      this.data[model] = val
    }
  }
}
</script>
