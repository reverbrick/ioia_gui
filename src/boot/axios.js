import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'

const axiosInstance = axios.create({
  paramsSerializer: params => {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  }
})

export default ({ Vue, router }) => {
  Vue.prototype.$axios = axios

  axios.interceptors.request.use(
    config => {
      config.headers.Authorization = 'Bearer ' + localStorage.getItem('access')
      return config
    },
    error => {
      Promise.reject(error)
    })

  axios.interceptors.response.use(response => {
    return response
  }, error => {
    const originalRequest = error.config
    /* if (error.response.status === 422) {
      router.push('/login')
      return Promise.reject(error)
    } */
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      localStorage.setItem('access', localStorage.getItem('refresh'))
      return axios.post('/api/v1/security/refresh')
        .then(res => {
          if (res.status === 200) {
            localStorage.setItem('access', res.data.access_token)
            return axios(originalRequest)
          }
        })
    }
    return Promise.reject(error)
  })
}

Vue.prototype.$axios = axiosInstance
window.axios = axiosInstance // remove
