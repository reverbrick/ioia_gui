function addParams (that, model) {
  if (that.$route.params.app) {
    if (model.includes('?')) {
      model = model + '&app=' + that.$route.params.app
    } else {
      model = model + '?app=' + that.$route.params.app
    }
  }
  return model
}

function axiosError (that, text, mood, caption) {
  that.$q.notify({
    color: mood,
    position: 'top',
    message: text,
    caption: caption,
    icon: 'report_problem'
  })
}

function axiosGet (that, name, dest, model, callback, failcallback) {
  model = addParams(that, model)
  that.loading = true
  that.$axios.get(`${that.api_link}/${model}`)
    .then((response) => {
      if (dest) {
        that.$set(that, dest, response.data.result)
      }
      if (callback) {
        that.$nextTick(() => { callback(response.data) })
      }
      that.loading = false
    })
    .catch(() => {
      axiosError(that, `Wystąpił błąd przy ładowaniu elementu ${name}!`, 'negative')
      if (failcallback) {
        that.$nextTick(() => { failcallback() })
      }
      that.loading = false
    })
}

function axiosPut (that, name, source, model, callback) {
  model = addParams(that, model)
  if (that.$route.params.app) {
    source.app = that.$route.params.app
  }
  that.loading = true
  that.$axios.put(`${that.api_link}/${model}`, source
  )
    .then((response) => {
      if (callback) {
        that.$nextTick(() => { callback(response.data) })
      }
      that.loading = false
    })
    .catch((error) => {
      axiosError(that, `Wystąpił błąd przy zapisywaniu elementu ${name}!`, 'negative', JSON.stringify(error.response.data.message))
      that.loading = false
    })
}
function axiosPost (that, name, source, model, callback) {
  if (that.$route.params.app) {
    source.app = that.$route.params.app
  }
  that.loading = true
  that.$axios.post(`${that.api_link}/${model}`, source
  )
    .then((response) => {
      if (callback) {
        that.$nextTick(() => { callback(response.data) })
      }
      that.loading = false
    })
    .catch((error) => {
      axiosError(that, `Wystąpił błąd przy dodawaniu elementu ${name}!`, 'negative', JSON.stringify(error.response.data.message))
      that.loading = false
    })
}
function axiosDelete (that, name, model, callback) {
  model = addParams(that, model)
  that.$q.dialog({
    title: 'Potwierdzenie',
    message: `Czy na pewno chcesz usunąć element ${name}?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    that.loading = true
    that.$axios.delete(`${that.api_link}/${model}`
    )
      .then((response) => {
        if (callback) {
          that.$nextTick(() => { callback(response.data) })
        }
        that.loading = false
        axiosError(that, `Usunięto element ${name}!`, 'positive')
      })
      .catch(() => {
        axiosError(that, `Wystąpił błąd przy usuwaniu elementu ${name}!`, 'negative')
        that.loading = false
      })
  })
}

export { axiosGet, axiosPut, axiosPost, axiosDelete, axiosError }
