<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{defs.label}}</div>
    </q-card-section>
    <q-form autofocus @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-card-section class="q-pt-none q-gutter-md">
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
          <q-select v-else-if="item.type=='json_node'" filled stack-label multiple use-chips use-input hide-dropdown-icon input-debounce="0" @new-value="createJsonNode" @click="clickJsonNode" :required="item.required" v-bind:key="item.field" v-model="data[fields[i].field]" :label="item.label"/>
          <!--TEXT-->
          <q-input dense v-else stack-label :required="item.required" v-bind:key="item.field" filled v-model="data[fields[i].field]" :label="item.label" :type="item.type"/>
        </template>
        <!--<Attachment v-if="data.zalacznik_" ref="zalacznik" label="Załączniki" max="3" :model="model" :id="id" :list="data.zalacznik" />-->
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn label="Zapisz" type="submit" color="positive"/>
        <q-btn label="Usuń" @click="remove" color="negative"/>
        <q-btn label="Anuluj" type="reset" color="primary" v-close-popup />
      </q-card-actions>
    </q-form>
    <q-dialog v-model="alert" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-red text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Wystąpił błąd!</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{error}}
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-red">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
// import Attachment from 'components/Attachment'
import gql from 'graphql-tag'
import { apolloCreate, apolloUpdate, apolloDelete, apolloFormDefsUpdate, apolloError } from '../boot/ioia.js'
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
        return apolloFormDefsUpdate(this, data)
      },
      error (error) {
        apolloError(this, error)
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
        apolloError(this, error)
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
      upload_url: '',
      alert: false,
      error: '',
      options: {}
    }
  },
  methods: {
    loadForm (id) {
      this.id = id
    },
    remove () {
      apolloDelete(this)
    },
    onSubmit () {
      if (this.id) { // existing
        apolloUpdate(this)
      } else { // new
        apolloCreate(this)
      }
    },
    onReset () {
    },
    clickJsonNode () {
      console.log('clickJsonNode')
    },
    createJsonNode (val, done) {
      // specific logic to eventually call done(...) -- or not
      done(val, 'add-unique')

      // done callback has two optional parameters:
      //  - the value to be added
      //  - the behavior (same values of new-value-mode prop,
      //    and when it is specified it overrides that prop –
      //    if it is used); default behavior (if not using
      //    new-value-mode) is to add the value even if it would
      //    be a duplicate
    }
  }
}
</script>
