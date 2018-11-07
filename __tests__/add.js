const plugin = require('../plugin')
const fixtures = require('./fixtures.js.fixture')
const constants = require('../constants')
const R = require('ramda')

const thisContext = R.clone(fixtures.defaultContext)

test('adds the boost config to magic-plate with RNN', async () => {
  let newContext = R.clone(thisContext)
  const { ignite, filesystem } = newContext
  const { addModule, patchInFile, copyBatch } = ignite
  const { write } = filesystem

  await plugin.add(newContext)

  for (const x of constants.APOLLO_NPM_MODULES) {
    expect(addModule.calledWith(x.package, x.options)).toEqual(true)
  }

//  expect(patchInFile.calledWith(`${process.cwd()}/src/navigation/ScreenRegistry.js`, {
//    after: `import { Navigation } from 'react-native-navigation'`,
//    insert: `import ApolloHOC from '../app/ApolloHoc'`
//  })).toEqual(true)

//   expect(copyBatch.calledWith(newContext,
//     [{ template: 'BoostApolloHoc.js.ejs',
//       target: `./src/app/ApolloHoc.js`
//     }], null, { quiet: true }
//   )).toEqual(true)

  expect(write.callCount).toEqual(1)
  expect(patchInFile.callCount).toEqual(2)
  expect(copyBatch.callCount).toEqual(1)
})

test('adds the boost config to bowser', async () => {
  const iread = () => { return { devDependencies: {'ignite-ir-boilerplate-bowser': '^0.0.1'} } }
  let newContext = R.mergeDeepRight(thisContext, { filesystem: { read: iread } })
  const { ignite, filesystem } = newContext
  const { addModule, patchInFile, copyBatch } = ignite
  const { write } = filesystem

  write.resetHistory()
  patchInFile.resetHistory()
  copyBatch.resetHistory()
  addModule.resetHistory()

  await plugin.add(newContext)

  for (const x of constants.APOLLO_NPM_MODULES) {
    expect(addModule.calledWith(x.package, x.options)).toEqual(true)
  }

  // Add the import for apollo provider.
  expect(patchInFile.calledWith(`${process.cwd()}/src/app/setup-root-store.ts`, {
    after: `import { Api } from "../services/api"`,
    insert: `import * as env from "../app/environment-variables"`
  })).toEqual(true)

  expect(patchInFile.calledWith(`${process.cwd()}/src/app/setup-root-store.ts`, {
    after: `import { Api } from "../services/api"`,
    insert: `import { ApolloProvider } from "react-apollo"`
  })).toEqual(true)

  expect(patchInFile.calledWith(`${process.cwd()}/src/app/setup-root-store.ts`, {
    after: `env.api = new Api()`,
    insert: `env.graphql = new ApolloClient({ uri: env.GRAPHQL_API })`
  })).toEqual(true)

  expect(patchInFile.calledWith(`${process.cwd()}/src/app/environment-variables.ts`, {
    after: `export const API = process.env.API`,
    insert: `\nexport const GRAPHQL_API = process.env.GRAPHQL_API`
  })).toEqual(true)

  expect(patchInFile.calledWith(`${process.cwd()}/.babelrc`, {
    replace: `        "include": ["NODE_ENV", "API"]`,
    insert: `        "include": ["NODE_ENV", "API", "GRAPHQL_API"]`
  })).toEqual(true)

  expect(write.callCount).toEqual(1)
  expect(patchInFile.callCount).toEqual(5)
})

test('adds custom config to basic-plate, with feature flag', async () => {
  let newContext = R.merge(thisContext, { parameters: { options: { custom: true } } })
  const { ignite, filesystem } = newContext
  const { patchInFile, copyBatch, addModule } = ignite
  const { write } = filesystem

  write.resetHistory()
  patchInFile.resetHistory()
  copyBatch.resetHistory()

  await plugin.add(newContext)

  for (const x of constants.CUSTOM_NPM_MODULES) {
    expect(addModule.calledWith(x.package, x.options)).toEqual(true)
  }

//   expect(patchInFile.calledWith(`${process.cwd()}/src/navigation/ScreenRegistry.js`, {
//     after: `import { Navigation } from 'react-native-navigation'`,
//     insert: `import ApolloHOC from '../app/ApolloHoc'`
//   })).toEqual(true)
// 
//   expect(copyBatch.calledWith(newContext,
//     [{ template: 'CustomApolloHoc.js.ejs',
//       target: `./src/app/ApolloHoc.js`
//     }], null, { quiet: true }
//   )).toEqual(true)

  expect(write.callCount).toEqual(1)
  expect(patchInFile.callCount).toEqual(2)
  expect(copyBatch.callCount).toEqual(1)
})

test('adds custom config to basic-plate, with function flag', async () => {
  let newContext = R.merge(thisContext, { parameters: { options: { custom: true } } })
  
  const { ignite, filesystem } = newContext
  const { patchInFile, copyBatch, addModule } = ignite
  const { write } = filesystem

  write.resetHistory()
  patchInFile.resetHistory()
  copyBatch.resetHistory()

  await plugin.add(newContext)

  for (const x of constants.CUSTOM_NPM_MODULES) {
    expect(addModule.calledWith(x.package, x.options)).toEqual(true)
  }

  expect(patchInFile.calledWith(`${process.cwd()}/src/Navigation/ScreenRegistry.js`, {
    after: `import { Navigation } from 'react-native-navigation'`,
    insert: `import ApolloHOC from '../src/App/ApolloHoc'`
  })).toEqual(true)

  expect(copyBatch.calledWith(newContext,
    [{ template: 'CustomApolloHoc.js.ejs',
      target: `./src/App/ApolloHoc.js`
    }], null, { quiet: true }
  )).toEqual(true)

  expect(write.callCount).toEqual(1)
  expect(patchInFile.callCount).toEqual(2)
  expect(copyBatch.callCount).toEqual(1)
})
