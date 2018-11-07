// No prizes for guessing whats in here.
const APOLLO_NPM_MODULES = [
  { package: 'graphql', options: { version: '^0.13.2' } },
  { package: 'apollo-boost', options: { version: '^0.1.0' } },
  { package: 'react-apollo', options: { version: '^2.1.0' } },
  { package: 'graphql-tag', options: { version: '^2.9.1' } }
]

const CUSTOM_NPM_MODULES = [
  { package: 'apollo-client', options: { version: '^2.3.5' } },
  { package: 'apollo-link-http', options: { version: '^1.5.4' } },
  { package: 'apollo-link-error', options: { version: '^1.1.0' } },
  { package: 'apollo-link', options: { version: '^1.2.2' } },
  { package: 'apollo-link-state', options: { version: '^0.4.1' } },
  { package: 'apollo-cache-inmemory', options: { version: '^1.2.5' } },
  { package: 'apollo-cache-persist', options: { version: '^0.1.1' } },
  { package: 'graphql', options: { version: '^0.13.2' } },
  { package: 'react-apollo', options: { version: '^2.1.0' } },
  { package: 'graphql-tag', options: { version: '^2.9.1' } }
]

const supportedBoilerplates = ['ignite-ir-boilerplate-bowser', 'ignite-web-magic', 'ignite-base-plate']

module.exports = { supportedBoilerplates, APOLLO_NPM_MODULES, CUSTOM_NPM_MODULES }
