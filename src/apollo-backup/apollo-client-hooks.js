import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'

export function apolloClientBeforeCreate ({ apolloClientConfigObj }) {
  const httpLink = createHttpLink({
    uri: process.env.GRAPHQL_URI || '/graphql'
  })
  const token = localStorage.getItem('token')
  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })
  if (token) {
    apolloClientConfigObj.link = authLink.concat(httpLink)
  }
}

export function apolloClientAfterCreate (/* { apolloClient, app, router, store, ssrContext, urlPath, redirect } */) {
  // if needed you can modify here the created apollo client
}
