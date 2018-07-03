const sinon = require('sinon')
const plugin = require('../plugin')
const fixtures = require('./fixtures.js.fixture')

test('adds the proper npm module', async () => {
  // spy on few things so we know they're called
  const addModule = sinon.spy()
  const patchInFile = sinon.spy()
  const write = sinon.spy()

  // mock a context
  const context = {
    ignite: { addModule, patchInFile, loadIgniteConfig: () => { return fixtures.igniteConfigOne } },
    filesystem: { write,
      read: () => {
        return { name: 'boilerplate',
          version: '0.0.1',
          devDependencies:
     { 'ignite-ir-boilerplate-bowser': '^0.0.1' } }
      }
    }
  }

  await plugin.add(context)

  expect(addModule.calledWith('apollo-boost', {version: '^0.1.0'})).toEqual(true)
  expect(addModule.calledWith('react-apollo')).toEqual(true)
  expect(addModule.calledWith('graphql-tag')).toEqual(true)
  expect(addModule.calledWith('graphql')).toEqual(true)
  expect(addModule.calledWith('@types/graphql', { version: '^0.13.0', dev: true })).toEqual(true)

  expect(patchInFile.calledWith(`${process.cwd()}/src/app/main.ts`, {
    after: 'import { StorybookUIRoot } from "../../storybook"',
    insert: 'import ApolloClient from "apollo-boost"'
  })).toEqual(true)

  expect(patchInFile.calledWith(`${process.cwd()}/src/app/main.ts`, {
    after: 'import ApolloClient from "apollo-boost"',
    insert: 'const client = new ApolloClient({ uri: GRAPHQL_API })'
  })).toEqual(true)

  expect(patchInFile.calledWith(`${process.cwd()}/src/app/environment-variables.ts`, {
    after: `declare var process: any`,
    insert: `\nexport const GRAPHQL_API: string | undefined = process.env.GRAPHQL_API`
  })).toEqual(true)

  expect(write.callCount).toEqual(1)
})
