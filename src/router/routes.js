import Main from 'layouts/MainLayout.vue'
import Login from 'pages/Login.vue'
import Index from 'pages/Index.vue'
import Scan from 'pages/Scan.vue'
import Editor from 'pages/Editor.vue'
import Grid from 'components/Grid.vue'
import Dashboard from 'pages/Dashboard.vue'
// import List_edit from 'pages/List_edit.vue'
import Table from 'components/Table.vue'
import TableEdit from 'components/TableEdit.vue'
import TableRoute from 'components/TableRoute.vue'
import TableDetailEdit from 'components/TableDetailEdit.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/', component: Main, children: [{ path: '', component: Index }] },
  { path: '/grid/:model', component: Main, children: [{ path: '', component: Grid }] },
  { path: '/scan', component: Main, children: [{ path: '', component: Scan }] },
  { path: '/table/:model', component: Main, children: [{ path: '', component: Table }] },
  { path: '/table_edit/:model', component: Main, children: [{ path: '', component: TableEdit, meta: { edit: true } }] },
  { path: '/table_detail_edit/:model', component: Main, children: [{ path: '', component: TableDetailEdit, meta: { edit: true } }] },
  { path: '/table_route/:model', component: Main, children: [{ path: '', component: TableRoute }] },
  { path: '/static/:id', component: Main, children: [{ path: '', component: Editor }] },
  { path: '/Dashboard', component: Main, children: [{ path: '', component: Dashboard }] }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
