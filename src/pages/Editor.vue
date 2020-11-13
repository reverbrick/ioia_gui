<template>
  <div class="q-pa-md q-gutter-sm fit">
    <q-input filled dense v-model="content.name" label="Nazwa" />
    <q-splitter v-model="splitterModel" style="height: 670px;">
      <template v-slot:separator>
        <q-avatar color="primary" text-color="white" size="28px" icon="sync_alt" />
      </template>
      <template v-slot:before>
        <div class="q-pa-md">
          <textarea v-model="content.body" rows="30" class="fit q-pa-sm" />
        </div>
      </template>
      <template v-slot:after>
        <div class="q-pa-md" style="height: 467px;">
          <q-markdown :src="content.body" class="fit bordered q-pa-sm" ></q-markdown>
        </div>
      </template>
    </q-splitter>
    <q-footer class="bg-white">
      <q-toolbar class="bg-white text-primary q-gutter-sm">
        <q-btn label="Zapisz" type="submit" color="primary" @click="onSubmit"/>
        <q-btn label="Usuń" type="submit" color="red" @click="onDelete"/>
        <q-btn label="Anuluj" type="reset" color="primary" flat class="q-ml-sm" @click="onCancel" />
      </q-toolbar>
      <br/>
    </q-footer>
  </div>
</template>
<style src="@quasar/quasar-ui-qmarkdown/dist/index.css"></style>
<script>
import gql from 'graphql-tag'
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
export default {
  components: {
    QMarkdown
  },
  apollo: {
    content: {
      query: gql`query ($id: ID!) {
        content: staticByNodeId(nodeId: $id) {
          name
          body
        }
      }`,
      variables () {
        return {
          id: this.$route.params.id
        }
      },
      update (data) {
        return data.content
      },
      error (error) {
        console.log(error)
      }
    }
  },
  data () {
    return {
      upload_url: `${this.api_link}/upload/?model=tresc&id=${this.$route.params.id}`,
      content: {
        name: '',
        body: ''
      },
      splitterModel: 50
    }
  },
  methods: {
    onSubmit () {
    },
    onDelete () {
    },
    onCancel () {
      this.$router.push('/static')
    },
    onRejected () {
    }
  }
}
</script>
