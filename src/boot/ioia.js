import VuePluralize from 'vue-pluralize'
import Vue from 'vue'

Vue.use(VuePluralize)

// var backend = 'https://rcp.ioia.io/api'
var backend = '/api'
var token = localStorage.getItem('token')

function apolloQueryNoBearer (query, variables, callback) {
  fetch(backend, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query,
      variables: variables
    })
  })
    .then(r => r.json())
    .then(
      function (data) {
        if (callback) {
          callback(data)
        }
      }
    )
    // .catch((err) => console.error(err))
}

function apolloQuery (query, variables, callback) {
  fetch(backend, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      authorization: token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify({
      query,
      variables: variables
    })
  })
    .then(r => r.json())
    .then(
      function (data) {
        if (callback) {
          callback(data)
        }
      }
    )
    // .catch((err) => console.error(err))
}

function apolloDefs (model, callback) {
  apolloQuery(
    `query ($model: String!) {
      defs: sourceByName(name: $model) {
        label
        columns
        fields
      }
    }`,
    {
      model: model
    },
    callback
  )
}

function apolloCreate (model, data, callback) {
  var model_ = model[0].toUpperCase() + model.substr(1) // first char to upper
  data = JSON.parse(JSON.stringify(data))
  delete data.__typename
  apolloQuery(
    `mutation ($data: ${model_}Input!) {create${model_} (input: {${model}: $data}){clientMutationId}}`,
    {
      data: data
    },
    callback
  )
}

function apolloUpdate (model, id, data, callback) {
  model = model[0].toUpperCase() + model.substr(1) // first char to upper
  data = JSON.parse(JSON.stringify(data))
  delete data.__typename
  apolloQuery(
    `mutation ($data: Update${model}ByNodeIdInput!) {update${model}ByNodeId (input: $data){clientMutationId}}`,
    {
      data: {
        nodeId: id,
        patch: data
      }
    },
    callback
  )
}

function apolloDelete (model, id, callback) {
  model = model[0].toUpperCase() + model.substr(1) // first char to upper
  apolloQuery(
    `mutation ($id: ID!) {delete${model}ByNodeId (input: {nodeId: $id}){clientMutationId}}`,
    {
      id: id
    },
    callback
  )
}

export { apolloCreate, apolloUpdate, apolloDelete, apolloQuery, apolloQueryNoBearer, apolloDefs }
