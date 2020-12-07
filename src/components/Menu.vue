<template>
  <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
    <div padding class="q-pa-md q-gutter-sm">
      <q-input class="q-ml-sm" dense debounce="300" ref="filter" v-model="filter" placeholder="Menu">
        <template v-slot:append>
          <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
          <q-icon name="search" />
        </template>
      </q-input>
      <q-spinner
        v-if="loading"
        color="primary"
        size="3em"
      />
      <q-tree
        :selected.sync="selected"
        :ticked.sync="ticked"
        :expanded.sync="expanded"
        :nodes="menu"
        node-key="id"
        :filter="filter"
        accordion
        @update:selected="menuClick"
        ref="tree"
        :loading="loading"
      />
    </div>
    <Error ref="err"/>
  </q-scroll-area>
</template>

<script>
import { apolloQuery } from '../boot/ioia.js'
import Error from 'components/Error'
export default {
  components: {
    Error
  },
  mounted () {
    this.loadMenu()
  },
  data () {
    return {
      filter: '',
      menu: [],
      selected: this.$router.currentRoute.fullPath,
      ticked: [],
      expanded: [],
      loading: true,
      menu_type: 'default'
    }
  },
  watch: {
    selected: function (newVal, oldVal) {
      if (!newVal) {
        this.selected = oldVal
      }
    },
    filter: function (newVal, oldVal) {
    },
    menu_type: function (newVal, oldVal) {
      if (newVal === 'mrproj') {
        this.loading = true
        apolloQuery(
          `query {
            projects {
              nodes {
                nodeId
                name
              }
            }
          }`,
          {},
          this.mrprojLoadCallback,
          'mrproj'
        )
      }
    }
  },
  methods: {
    loadMenu () {
      apolloQuery(
        `query {
            vMenus(filter: {parent: {isNull: true}}, orderBy: [WEIGHT_ASC]) {
              nodes {
                nodeId
                name
                label
                link
                icon
                vMenusByParent(orderBy: [WEIGHT_ASC]) {
                  nodes {
                    nodeId
                    name
                    label
                    link
                    icon
                    vMenusByParent(orderBy: [WEIGHT_ASC]) {
                      nodes {
                        nodeId
                        name
                        label
                        link
                        icon
                      }
                    }
                  }
                }
              }
            }
          }`,
        {},
        this.menuLoadCallback,
        'menu'
      )
    },
    menuLoadCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Menu')
      } else {
        data = data.data
        this.menu = this.formatMenu(data.vMenus)
        this.$nextTick(() => {
          // this.$refs.tree.expandAll()
        })
      }
      this.loading = false
    },
    mrprojLoadCallback (data) {
      if (data.errors) {
        this.$refs.err.display(data.errors, 'Menu')
      } else {
        data = data.data
        // get dummy node and remove it
        var dummy = []
        var i = 0
        this.menu.forEach((value) => {
          if (value.name === 'mrproj') {
            this.menu.splice(i, 1)
            dummy = value.children
          }
          i++
        })
        // add project nodes
        data.projects.nodes.forEach((value) => {
          var mnu = { id: value.nodeId, name: value.name, label: value.name, selectable: false }
          // TODO this is broken
          mnu.children = JSON.parse(JSON.stringify(dummy))
          mnu.children.forEach((child) => {
            child.link = child.link.replace('#proj#', value.name)
          })
          this.menu.push(mnu)
        })
      }
      this.loading = false
    },
    formatMenu (menus) {
      var out = []
      menus.nodes.forEach((value) => {
        var mnu = { id: value.nodeId, name: value.name, label: value.label, link: value.link }
        if (value.link) mnu.id = value.link // helpful to highlight current link
        if (value.icon) {
          mnu.icon = value.icon
        }
        if (!value.link) {
          mnu.selectable = false
        }
        if (value.vMenusByParent) {
          mnu.children = this.formatMenu(value.vMenusByParent)
        }
        out.push(mnu)
      })
      return out
    },
    resetFilter () {
      this.filter = ''
      this.$refs.filter.focus()
    },
    menuClick (obj) {
      if (this.selected !== '' && this.selected !== null) {
        var link = this.$refs.tree.getNodeByKey(this.selected).link
        if (link !== this.$router.currentRoute.fullPath) {
          this.$root.$children[0].$children[0].breadcrumbs = [
            { label: 'Strona główna', icon: 'home', to: '/' }
          ]
          this.$router.push(link)
        }
      }
    }
  }
}
</script>
