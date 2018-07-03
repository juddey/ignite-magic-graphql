const sinon = require('sinon')
const query = require('../commands/query')
const R = require('ramda')

const copyBatch = sinon.spy()
const patchInFile = sinon.spy()
const pascalCase = sinon.spy()
const isBlank = sinon.spy()
const isNotString = sinon.spy()

const context = {
  strings: { pascalCase, isBlank, isNotString },
  ignite: { copyBatch, patchInFile, loadIgniteConfig: () => {} },
  print: { info: () => {} }
}

const contextOne = R.merge(context, { parameters: {} })
const contextTwo = R.mergeDeepRight(context, {
  parameters: { first: 'sausages', second: '' },
  ignite: {
    loadIgniteConfig: () => {
      return { graphql: { contextRequired: true } }
    }
  }
})
const contextThree = R.mergeDeepRight(context, {
  parameters: { first: 'sausages', second: 'welcome' },
  ignite: {
    loadIgniteConfig: () => {
      return {
        graphql: { contextRequired: true, component_location: './src/views' }
      }
    }
  }
})

test('rejects when graphql prop is blank', async () => {
  // spy on few things so we know they're called
  await query(context)
  expect(copyBatch.callCount).toEqual(0)
})

test('rejects when first parameter is blank', async () => {
  await query(contextOne)
  expect(copyBatch.callCount).toEqual(0)
})

test('rejects when context is required and second parameter is blank', async () => {
  await query(contextTwo)
  expect(copyBatch.callCount).toEqual(0)
})

test('passes through when parameters are valid', async () => {
  await query(contextThree)
  expect(copyBatch.callCount).toEqual(1)
})
