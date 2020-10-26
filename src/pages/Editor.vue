<template>
  <div class="q-pa-md q-gutter-sm fit">
    <q-input filled dense v-model="data.nazwa" label="Nazwa" />
    <q-splitter v-model="splitterModel" style="height: 670px;">
      <template v-slot:separator>
        <q-avatar color="primary" text-color="white" size="28px" icon="sync_alt" />
      </template>
      <template v-slot:before>
        <div class="q-pa-md">
          <textarea v-model="data.tresc" rows="30" class="fit q-pa-sm" />
        </div>
      </template>
      <template v-slot:after>
        <div class="q-pa-md" style="height: 467px;">
          <q-markdown :src="data.tresc" class="fit bordered q-pa-sm" ></q-markdown>
        </div>
      </template>
    </q-splitter>
    <q-footer class="bg-white">
      <q-toolbar class="bg-white text-primary q-gutter-sm">
        <q-btn label="Zapisz" type="submit" color="primary" @click="onSubmit"/>
        <q-btn label="Usuń" type="submit" color="red" @click="onDelete"/>
        <q-btn label="Anuluj" type="reset" color="primary" flat class="q-ml-sm" @click="onCancel" />
        <q-space />
        <q-btn label="Załączniki" color="primary" @click="attachments =! attachments" />
      </q-toolbar>
      <br/>
    </q-footer>
    <q-drawer side="right" v-model="attachments" bordered :width="301" :breakpoint="500" content-class="bg-grey-3" >
      <Attachment label="Załączniki" max="3" model="tresc" :id="$route.params.id" :list="data.zalacznik" />
    </q-drawer>
  </div>
</template>
<style src="@quasar/quasar-ui-qmarkdown/dist/index.css"></style>
<script>
import { QMarkdown } from '@quasar/quasar-ui-qmarkdown'
import Attachment from 'components/Attachment'
export default {
  components: {
    QMarkdown,
    Attachment
  },
  data () {
    return {
      upload_url: `${this.api_link}/upload/?model=tresc&id=${this.$route.params.id}`,
      data: {
        nazwa: '',
        tresc: ''
      },
      splitterModel: 50,
      attachments: false
    }
  },
  mounted: function () {
    this.loadData()
  },
  methods: {
    loadData () {
      if (this.$route.params.id !== '0') {
        this.loading = true
        this.$axios.get(`${this.api_link}/tresc/${this.$route.params.id}?q=(keys:!(none))`)
          .then((response) => {
            this.data = response.data.result
            this.loading = false
          })
          .catch(() => {
            this.$q.notify({
              color: 'negative',
              position: 'top',
              message: 'Error loading table!',
              icon: 'report_problem'
            })
            this.loading = false
          })
      }
    },
    onSubmit () {
      this.loading = true
      delete this.data.zalacznik
      if (this.$route.params.id !== '0') {
        this.$axios.put(`${this.api_link}/tresc/${this.$route.params.id}`, JSON.parse(JSON.stringify(this.data))
        )
          .then((response) => {
            // this.loadData()
            this.$router.push('/list/tresc')
            this.loading = false
          })
          .catch(() => {
            this.$q.notify({
              color: 'negative',
              position: 'top',
              message: 'Error saving form!',
              icon: 'report_problem'
            })
            this.loading = false
          })
      } else {
        this.$axios.post(`${this.api_link}/tresc/`, JSON.parse(JSON.stringify(this.data))
        )
          .then((response) => {
            this.$router.push('/list/tresc')
            this.loading = false
          })
          .catch(() => {
            this.$q.notify({
              color: 'negative',
              position: 'top',
              message: 'Error saving form!',
              icon: 'report_problem'
            })
            this.loading = false
          })
      }
    },
    onDelete () {
      this.$q.dialog({
        title: 'Confirm',
        message: `Are you sure to remove item id:${this.$route.params.id}?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.loading = true
        this.$axios.delete(`${this.api_link}/tresc/${this.$route.params.id}`
        )
          .then((response) => {
            this.loading = false
            this.$router.push('/list/tresc')
            this.$q.notify({
              color: 'positive',
              position: 'top',
              message: 'Deleted!',
              icon: 'report_problem'
            })
          })
          .catch(() => {
            this.$q.notify({
              color: 'negative',
              position: 'top',
              message: 'Error deleting!',
              icon: 'report_problem'
            })
            this.loading = false
          })
      })
    },
    onCancel () {
      this.$router.push('/list/tresc')
    },
    onRejected () {

    }
  }
}
</script>
