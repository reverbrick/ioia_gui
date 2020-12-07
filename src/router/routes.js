import Main from 'layouts/MainLayout.vue'
import Login from 'pages/Login.vue'
import Index from 'pages/Index.vue'
import Scan from 'pages/Scan.vue'
import Order from 'pages/Order.vue'
import Grid from 'components/Grid.vue'
import Dashboard from 'pages/Dashboard.vue'
import Table from 'components/Table.vue'
import TableEdit from 'components/TableEdit.vue'
import TableRoute from 'components/TableRoute.vue'
import TableDetailEdit from 'components/TableDetailEdit.vue'
import Error404 from 'pages/Error404.vue'
import Static from 'pages/Static.vue'
import Tasks from 'pages/Tasks.vue'
import Project from 'pages/Project.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/', component: Main, children: [{ path: '', component: Index }] },
  { path: '/grid/:model', component: Main, children: [{ path: '', component: Grid }] },
  { path: '/scan', component: Main, children: [{ path: '', component: Scan }] },
  { path: '/table/:model', component: Main, children: [{ path: '', component: Table }] },
  { path: '/table_edit/:model', component: Main, children: [{ path: '', component: TableEdit, meta: { edit: true } }] },
  { path: '/table_detail_edit/:model', component: Main, children: [{ path: '', component: TableDetailEdit, meta: { edit: true } }] },
  { path: '/table_route/:model', component: Main, children: [{ path: '', component: TableRoute, meta: { edit: true } }] },
  { path: '/Dashboard', component: Main, children: [{ path: '', component: Dashboard }] },
  { path: '/:app/Dashboard', component: Main, children: [{ path: '', component: Dashboard }] },
  { path: '/:app/Project', component: Main, children: [{ path: '', component: Project }] },
  { path: '/order/:id', component: Main, children: [{ path: '', component: Order }] },
  { path: '/:app/static/:id', component: Main, children: [{ path: '', component: Static }] },
  { path: '/:app/tasks/:id', component: Main, children: [{ path: '', component: Tasks }] }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: Main,
    children: [{ path: '', component: Error404 }]
  })
}

export default routes
