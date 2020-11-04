<template>
  <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
    <div padding class="q-pa-md q-gutter-sm">
      <q-input class="q-ml-sm" dense debounce="300" ref="filter" v-model="filter" placeholder="Menu">
        <template v-slot:append>
          <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
          <q-icon name="search" />
        </template>
      </q-input>
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
      />
    </div>
  </q-scroll-area>
</template>

<script>
import gql from 'graphql-tag'
export default {
  apollo: {
    menus: {
      query: gql`
        query {
          menus(filter: {parent: {isNull: true}}) {
            nodes {
              nodeId
              name
              label
              link
              icon
              menusByParent {
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
      `
    }
  },
  data () {
    return {
      filter: '',
      menu: [],
      selected: this.$router.currentRoute.fullPath,
      ticked: [],
      expanded: []
    }
  },
  watch: {
    selected: function (newVal, oldVal) {
      if (!newVal) {
        this.selected = oldVal
      }
    },
    filter: function (newVal, oldVal) {
      if (newVal === 'admin') {
        location.replace('/users/list/')
      }
      if (newVal === 'swagger') {
        location.replace('/swagger/v1')
      }
    },
    menus () {
      this.menu = this.formatMenu(this.menus)
      this.$nextTick(() => { this.$refs.tree.expandAll() })
    }
  },
  methods: {
    formatMenu (menus) {
      var out = []
      menus.nodes.forEach((value) => {
        var mnu = { id: value.nodeId, name: value.name, label: value.label, link: value.link }
        if (value.icon) {
          mnu.icon = value.icon
        }
        if (!value.link) {
          mnu.selectable = false
        }
        if (value.menusByParent) {
          mnu.children = this.formatMenu(value.menusByParent)
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
          this.$router.push(link)
        }
      }
    }
  }
}
</script>
