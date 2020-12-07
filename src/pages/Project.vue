<template>
  <div class="q-pa-md q-gutter-sm" align="center">
    <q-btn style="width: 450px" glossy stack color="grey" size="xl" icon="help" label="Problemy do rozwiązania" @click="showMarkdown('problemy')" />
    <q-btn style="width: 450px" glossy stack color="grey" size="xl" icon="trending_up" label="Cel" @click="showMarkdown('cel')" /><br/>
    <q-btn style="width: 450px" glossy stack color="grey" size="xl" icon="subject" label="Wymagania" @click="showMarkdown('wymagania')" />
    <q-btn style="width: 450px" glossy stack color="grey" size="xl" icon="description" label="Opis projektu" @click="showMarkdown('opis')" /><br/>
    <q-btn style="width: 450px" glossy stack color="grey" size="xl" icon="report" label="Zagrożenia" @click="showMarkdown('zagrożenia')" />
    <q-btn style="width: 450px" glossy stack color="grey" size="xl" icon="emoji_flags" label="Kamienie milowe" @click="showMarkdown('kamienie')" /><br/>
    <q-btn style="width: 450px" glossy stack color="grey" size="xl" icon="attach_money" label="Budżet" @click="showMarkdown('budżet')" />
    <q-btn style="width: 450px" glossy stack color="grey" size="xl" icon="fact_check" label="Kryteria akceptacji" @click="showMarkdown('kryteria')" /><br/>
    <q-btn style="width: 450px" glossy stack color="grey" size="xl" icon="supervisor_account" label="Biuro projektu" @click="showMarkdown('biuro')" />
    <q-btn style="width: 450px" glossy stack color="grey" size="xl" icon="group_work" label="Zespół wdrożeniowy" @click="showMarkdown('zespół')" />
    <q-dialog v-model="popup">
      <q-card class="col-3">
        <q-card-section class="row items-center q-pb-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <img :src=" 'statics/'+file+'.png' ">
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="popup_md">
      <q-card class="col-3">
        <q-card-section class="row items-center q-pb-none">
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-markdown :src="markdown" class="fit bordered q-pa-sm" ></q-markdown>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
import { apolloQuery } from '../boot/ioia.js'
export default {
  components: {
    QMarkdown
  },
  watch: {
    $route: function (newVal) {
      this.bread()
    }
  },
  mounted () {
    this.bread()
    // this.$q.loading.show()
  },
  data () {
    return {
      popup: false,
      popup_md: false,
      file: '',
      markdown: ''
    }
  },
  methods: {
    showMarkdown (doc) {
      apolloQuery(
        `query ($name: String!, $project: String!) {
          statics(filter: {name: {equalTo: $name}, project: {equalTo: $project}}) {
            nodes {
              body
            }
          }
        }`,
        {
          name: doc,
          project: this.$route.params.app
        },
        this.dataUpdateCallback
      )
    },
    dataUpdateCallback (data) {
      if (data.errors) {
        // this.$refs.err.display(data.errors, 'Treści')
      } else {
        data = data.data.statics.nodes
        if (data.length !== 0) {
          this.markdown = data[0].body
          this.popup_md = true
        }
      }
    },
    bread () {
      this.$root.$children[0].$children[0].breadcrumbs = [{ label: 'Strona główna', icon: 'home', to: '/' }]
      if (this.$route.params.app) this.$root.$children[0].$children[0].breadcrumbs.push({ label: this.$route.params.app, icon: undefined, click: '' })
      this.$root.$children[0].$children[0].breadcrumbs.push({ label: 'Założenia projektu', icon: undefined, click: '' })
    }
  }
}
</script>
