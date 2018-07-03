// No prizes for guessing whats in here.
const NPM_MODULES = [
  { package: 'graphql', options: { version: '^0.13.2' } },
  { package: 'apollo-boost', options: { version: '^0.1.0' } },
  { package: 'react-apollo', options: { version: '^2.1.0' } },
  { package: 'graphql-tag', options: { version: '^2.9.1' } },
  { package: 'apollo-cache-persist', options: { version: '^0.1.1' } },
  { package: '@types/graphql', options: { version: '^0.13.0', dev: true } }
]

const supportedBoilerplates = ['ignite-ir-boilerplate-bowser']

module.exports = { supportedBoilerplates, NPM_MODULES }
