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
        <q-btn label="Zapisz" type="submit" color="positive" @click="onSubmit"/>
        <q-btn label="Usuń" type="submit" color="negative" @click="onDelete"/>
        <q-btn label="Anuluj" type="reset" color="primary" @click="onCancel" />
      </q-toolbar>
      <br/>
    </q-footer>
    <Error ref="err"/>
  </div>
</template>
<style src="@quasar/quasar-ui-qmarkdown/dist/index.css"></style>
<script>
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
import { apolloQuery, apolloCreate, apolloUpdate, apolloDelete } from '../boot/ioia.js'
import Error from 'components/Error'
export default {
  components: {
    QMarkdown,
    Error
  },
  mounted () {
    this.loadForm()
    this.$root.$children[0].$children[0].breadcrumbs = [
      { label: 'Strona główna', icon: 'home', to: '/' },
      { label: 'Edytor', icon: undefined, click: '' }
    ]
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
    loadForm () {
      if (this.$route.params.id !== 'new') {
        apolloQuery(
          `query ($id: ID!) {
            content: staticByNodeId(nodeId: $id) {
              name
              body
            }
          }`,
          {
            id: this.$route.params.id
          },
          this.updateCallback
        )
      }
    },
    updateCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Edytor')
      } else {
        this.content = data.data.content
      }
    },
    submitCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Edytor')
      } else {
        this.$router.go(-1)
      }
    },
    onSubmit () {
      if (this.$route.params.id !== 'new') { // existing
        apolloUpdate('static', this.$route.params.id, this.content, this.submitCallback)
      } else { // new
        apolloCreate('static', this.content, this.submitCallback)
      }
    },
    onDelete () {
      this.$q.dialog({
        title: 'Potwierdzenie',
        message: 'Czy na pewno chcesz usunąć element Treść?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        apolloDelete('static', this.$route.params.id, this.submitCallback)
      })
    },
    onCancel () {
      this.$router.go(-1)
    }
  }
}
</script>
