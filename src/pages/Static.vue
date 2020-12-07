<template>
  <div class="q-pa-md">
    <q-markdown :src="markdown" class="fit bordered q-pa-sm" ></q-markdown>
    <Error ref="err"/>
  </div>
</template>

<script>
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
import { apolloQuery } from '../boot/ioia.js'
import Error from 'components/Error'
export default {
  components: {
    QMarkdown,
    Error
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
  data () {
    return {
      markdown: ''
    }
  },
  methods: {
    loadData () {
      this.$root.$children[0].$children[0].breadcrumbs = [{ label: 'Strona główna', icon: 'home', to: '/' }]
      if (this.$route.params.app) this.$root.$children[0].$children[0].breadcrumbs.push({ label: this.$route.params.app, icon: undefined, click: '' })
      this.$root.$children[0].$children[0].breadcrumbs.push({ label: 'Treści', icon: undefined, click: '' })
      this.loading = true
      apolloQuery(
        `query ($name: String!, $project: String!) {
          statics(filter: {name: {equalTo: $name}, project: {equalTo: $project}}) {
            nodes {
              body
            }
          }
        }`,
        {
          name: this.$route.params.id,
          project: this.$route.params.app
        },
        this.dataUpdateCallback
      )
    },
    dataUpdateCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Treści')
      } else {
        data = data.data.statics.nodes
        if (data.length !== 0) {
          this.markdown = data[0].body
        } else {
          this.$router.push('/404')
        }
      }
      this.loading = false
    }
  }
}
</script>
