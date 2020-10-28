import Main from 'layouts/MainLayout.vue'
import Editor from 'pages/Editor.vue'
import Index from 'pages/Index.vue'
import Podsumowanie from 'pages/Podsumowanie.vue'
import List from 'pages/List.vue'
import Form from 'pages/Form.vue'
import ListEdit from 'pages/List_edit.vue'
import Table2 from 'pages/Table2.vue'
import Login from 'pages/Login.vue'
import FormZamowienie from 'pages/Zamowienie.vue'
import Zadania from 'pages/Zadania.vue'
import Kontakt from 'pages/Kontakt.vue'

const routes = [
  { path: '/kontakt', component: Main, children: [{ path: '', component: Kontakt, meta: { title: 'Kontakt' } }] },
  { path: '/login', component: Login },
  { path: '/table2', component: Main, children: [{ path: '', component: Table2 }] },
  { path: '/', component: Main, children: [{ path: '', component: Index, meta: { title: '' } }] },
  { path: '/:app', component: Main, children: [{ path: '', component: Podsumowanie, meta: { title: 'Podsumowanie' } }] },
  { path: '/list/:id', component: Main, children: [{ path: '', component: List, meta: { title: 'Lista' } }] },
  { path: '/:app/list/:id', component: Main, children: [{ path: '', component: List, meta: { title: 'Lista' } }] },
  { path: '/list_edit/:id', component: Main, children: [{ path: '', component: ListEdit, meta: { title: 'Lista' } }] },
  { path: '/:app/list_edit/:id', component: Main, children: [{ path: '', component: ListEdit, meta: { title: 'Lista' } }] },
  { path: '/zamowienie/:id', component: Main, children: [{ path: '', component: FormZamowienie, meta: { title: 'Zamówienie' } }] },
  { path: '/:app/zadania/:id', component: Main, children: [{ path: '', component: Zadania, meta: { title: 'Zadania' } }] },
  { path: '/tresc/:id', component: Main, children: [{ path: '', component: Editor, meta: { title: 'Treści' } }] },
  { path: '/:model/:id', component: Main, children: [{ path: '', component: Form, meta: { title: 'Formularz' } }] },
  { path: '/:app/:model/:id', component: Main, children: [{ path: '', component: Form, meta: { title: 'Formularz' } }] },
  { path: '/test', component: Main }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
