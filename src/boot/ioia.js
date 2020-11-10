import gql from 'graphql-tag'

function showError (that, text, mood, caption) {
  that.$q.notify({
    color: mood,
    position: 'top',
    message: text,
    caption: caption,
    icon: 'report_problem'
  })
}

function apolloFormDefsUpdate (that, data) {
  if (data.defs !== null) {
    if (data.defs.fields) {
      that.fields = data.defs.fields
      var fields = ''
      if (that.id) { // existing
        data.defs.fields.forEach(function (col) {
          fields = fields + ` ${col.field}`
        })
        that.query = `${that.$route.params.model}ByNodeId(nodeId: $id) {${fields}}`
        that.$nextTick(() => { that.$apollo.queries.data.skip = false })
      }
      // populate options for Select
      data.defs.fields.forEach(function (col) {
        if (col.type === 'select' && that.options[col.model] === undefined) { // only once
          that.options[col.model] = []
          that.$apollo.addSmartQuery(col.model, {
            query: gql`query { options: ${col.model} {nodes {id name}}}`,
            update (data) {
              data.options.nodes.forEach(function (opt) {
                that.options[col.model].push({ label: opt.name, value: opt.id })
              })
            },
            error (error) {
              apolloError(this, error)
            }
          })
        }
      })
    }
  } else {
    showError(`Wystąpił błąd przy ładowaniu definicji elementu ${that.$route.params.model}!`, 'negative', 'Nie znaleziono elementu.')
  }
  return data.defs
}

function apolloTableDefsUpdate (that, data) {
  if (data.defs !== null) {
    if (data.defs.columns) {
      that.columns = ''
      that.order = '[]'
      data.defs.columns.forEach(function (col) {
        if (col.type === 'related_name') that.columns = that.columns + ` ${col.field} {name}`
        else that.columns = that.columns + ` ${col.field}`
      })
      that.query = `${that.$route.params.model}s(first:${that.pagination.rowsPerPage}, offset: $offset, orderBy: ${that.order}) {nodes {nodeId${that.columns}} totalCount}`
      that.$nextTick(() => { that.$apollo.queries.rows.skip = false })
    } else {
      data.defs.columns = []
    }
  } else {
    showError(`Wystąpił błąd przy ładowaniu definicji elementu ${that.$route.params.model}!`, 'negative', 'Nie znaleziono elementu.')
  }
  return data.defs
}

function apolloError (that, error) {
  showError(`Wystąpił błąd przy ładowaniu elementu ${that.$route.params.model}!`, 'negative', error.toString())
}

function apolloCreate (that) {
  var model = `${that.$route.params.model}`
  model = model[0].toUpperCase() + model.substr(1) // first char to upper
  var cols = ''
  var data = JSON.parse(JSON.stringify(that.data))
  that.fields.forEach(function (col) {
    if (col.type === 'select' | col.type === 'boolean' | col.type === 'number' | data[col.field] === null) {
      cols = cols + `${col.field}: ${data[col.field]} `
    } else {
      cols = cols + `${col.field}: "${data[col.field]}" `
    }
  })
  var patch = `create${model} (input: {${that.$route.params.model}: {${cols}}}){clientMutationId}`
  that.$apollo.mutate({
    mutation: gql`mutation {${patch}}`
  }).then(() => {
    that.$emit('loadData')
    that.$emit('openPopup', false)
  }).catch((error) => {
    that.alert = true
    that.error = error
  })
}

function apolloUpdate (that) {
  var model = `${that.$route.params.model}`
  model = model[0].toUpperCase() + model.substr(1) // first char to upper
  var cols = ''
  var data = JSON.parse(JSON.stringify(that.data))
  that.fields.forEach(function (col) {
    if (col.type === 'select' | col.type === 'boolean' | col.type === 'number' | data[col.field] === null) {
      cols = cols + `${col.field}: ${data[col.field]} `
    } else {
      cols = cols + `${col.field}: "${data[col.field]}" `
    }
  })
  var patch = `update${model}ByNodeId (input: {nodeId: $id, patch: {${cols}}}){clientMutationId}`
  that.$apollo.mutate({
    mutation: gql`mutation ($id: ID!) {${patch}}`,
    variables: {
      id: that.id
    }
  }).then(() => {
    that.$emit('loadData')
    that.$emit('openPopup', false)
  }).catch((error) => {
    that.alert = true
    that.error = error
  })
}

function apolloDelete (that) {
  that.$q.dialog({
    title: 'Potwierdzenie',
    message: `Czy na pewno chcesz usunąć element ${that.$route.params.model}?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    var model = `${that.$route.params.model}`
    model = model[0].toUpperCase() + model.substr(1) // first char to upper
    var cols = ''
    var data = JSON.parse(JSON.stringify(that.data))
    that.fields.forEach(function (col) {
      if (col.type === 'boolean' | col.type === 'int') {
        cols = cols + `${col.field}: ${data[col.field]} `
      } else {
        cols = cols + `${col.field}: "${data[col.field]}" `
      }
    })
    var patch = `delete${model}ByNodeId (input: {nodeId: $id}){clientMutationId}`
    that.$apollo.mutate({
      mutation: gql`mutation ($id: ID!) {${patch}}`,
      variables: {
        id: that.id
      }
    }).then(() => {
      that.$emit('loadData')
      that.$emit('openPopup', false)
    }).catch((error) => {
      that.alert = true
      that.error = error
    })
  })
}

export { apolloCreate, apolloUpdate, apolloDelete, apolloFormDefsUpdate, apolloTableDefsUpdate, apolloError }
