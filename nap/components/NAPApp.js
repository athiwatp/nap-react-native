import React from 'react'
import { AppRegistry } from 'react-native'
import App from '../app'

import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

import persist from '../lib/persist'

const NAPApp = (options) => {
  // Default 
  options.opts = options.opts || { credentials: 'same-origin' }

  // Our app
  const nap = () => {

    const networkInterface = createNetworkInterface(options)

    // Authen
    networkInterface.use([{
      applyMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {}  // Create the header object if needed.
        }

        // get the authentication token from local storage if it exists
        (async () => {
          // await persist.willRemoveSessionToken()
          const sessionToken = await persist.willGetSessionToken()
          // alert('sessionToken:' + sessionToken)
          req.options.headers.authorization = sessionToken ? `Bearer ${sessionToken}` : null
          next()
        })()
      }
    }])

    const client = new ApolloClient({
      dataIdFromObject: result => result.id || null,
      networkInterface
    })

    return (
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>)
  }
  AppRegistry.registerComponent(options.name, () => nap)
}

export default NAPApp