import Main from 'layouts/MainLayout.vue'
import Login from 'pages/Login.vue'
import Index from 'pages/Index.vue'
import Scan from 'pages/Scan.vue'
import Editor from 'pages/Editor.vue'
import Grid from 'components/Grid.vue'
// import List_edit from 'pages/List_edit.vue'
import Table from 'components/Table.vue'
import TableEdit from 'components/TableEdit.vue'
import TableDetailEdit from 'components/TableDetailEdit.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/', component: Main, children: [{ path: '', component: Index, meta: { title: '' } }] },
  { path: '/grid/:model', component: Main, children: [{ path: '', component: Grid, meta: { title: '' } }] },
  { path: '/scan', component: Main, children: [{ path: '', component: Scan, meta: { title: 'Skanuj QR' } }] },
  { path: '/table/:model', component: Main, children: [{ path: '', component: Table, meta: { title: 'Tabela' } }] },
  { path: '/table_edit/:model', component: Main, children: [{ path: '', component: TableEdit, meta: { title: 'Edycja' } }] },
  { path: '/table_detail_edit/:model', component: Main, children: [{ path: '', component: TableDetailEdit, meta: { title: 'Edycja' } }] },
  { path: '/static/:id', component: Main, children: [{ path: '', component: Editor, meta: { title: 'Treści' } }] }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
