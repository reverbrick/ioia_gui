<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{defs.label}}</div>
    </q-card-section>
    <q-form autofocus @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-card-section class="q-pt-none q-gutter-md">
        <template v-for="(item, i) in fields">
          <q-toggle v-if="item.type=='boolean'" stack-label :required="item.required" v-bind:key="item.field" v-model="data[fields[i].field]" :label="item.label" :type="item.type"/>
          <q-input v-else stack-label :required="item.required" v-bind:key="item.field" filled v-model="data[fields[i].field]" :label="item.label" :type="item.type"/>
        </template>
        <!--<Attachment v-if="data.zalacznik_" ref="zalacznik" label="Załączniki" max="3" :model="model" :id="id" :list="data.zalacznik" />-->
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
// import Attachment from 'components/Attachment'
import gql from 'graphql-tag'
export default {
  components: {
    // Attachment
  },
  props: ['model'],
  apollo: {
    defs: {
      query: gql`query ($model: String!) {
        defs: sourceByName(name: $model) {
          label
          fields
        }
      }`,
      variables () {
        return {
          model: this.$route.params.model
        }
      },
      update (data) {
        if (data.defs !== null) {
          if (data.defs.fields) {
            this.fields = data.defs.fields
            var fields = ''
            data.defs.fields.forEach(function (col) {
              fields = fields + ` ${col.field}`
            })
            this.query = `${this.$route.params.model}ByNodeId(nodeId: $id) {${fields}}`
            this.$nextTick(() => { this.$apollo.queries.data.skip = false })
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
    data: {
      query () {
        return gql`query ($id: ID!) {data: ${this.query}}`
      },
      variables () {
        return {
          id: this.id
        }
      },
      update (data) {
        return data.data
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
      defs: {},
      data: {},
      query: '',
      id: undefined,
      fields: [],
      upload_url: ''
    }
  },
  methods: {
    loadForm (id) {
      this.id = id
    },
    remove () {

    },
    onSubmit () {
      var model = `${this.$route.params.model}`
      model = model[0].toUpperCase() + model.substr(1) // first char to upper
      var cols = ''
      var data = JSON.parse(JSON.stringify(this.data))
      this.fields.forEach(function (col) {
        if (col.type === 'boolean' | col.type === 'int') {
          cols = cols + `${col.field}: ${data[col.field]} `
        } else {
          cols = cols + `${col.field}: "${data[col.field]}" `
        }
      })
      var patch = `update${model}ByNodeId (input: {nodeId: $id, patch: {${cols}}}){clientMutationId}`
      this.$apollo.mutate({
        mutation: gql`mutation ($id: ID!) {${patch}}`,
        variables: {
          id: this.id
        }
      }).then(() => {
        this.$emit('loadData')
        this.$emit('openPopup', false)
      }).catch((error) => {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: `Wystąpił błąd przy zapisywaniu elementu ${this.$route.params.model}!`,
          caption: error.toString(),
          icon: 'report_problem'
        })
      })
    },
    editRow () {

    },
    onReset () {
    }
  }
}
</script>
