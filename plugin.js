// Ignite CLI plugin for GraphqlMagic
// ----------------------------------------------------------------------------

const NPM_MODULES = [
  { package: 'graphql', options: { version: '^0.13.2' } },
  { package: 'apollo-boost', options: { version: '^0.1.0' } },
  { package: 'react-apollo', options: { version: '^2.1.0' } },
  { package: 'graphql-tag', options: { version: '^2.9.1' } },
  { package: 'apollo-cache-persist', options: { version: '^0.1.1' } },
  { package: '@types/graphql', options: { version: '^0.13.0', dev: true } }
]

const constants = require('./constants')
const R = require('ramda')

// const PLUGIN_PATH = __dirname
// const APP_PATH = process.cwd()

const add = async function (context) {
  // Learn more about context: https://infinitered.github.io/gluegun/#/context-api.md
  const { ignite, filesystem } = context
  const pkg = filesystem.read('package.json', 'json')
  const igniteConfig = ignite.loadIgniteConfig()

  // installeth the npm modules
  for (const x of NPM_MODULES) { await ignite.addModule(x.package, x.options) }

  const hasValidBoilerplate =
    R.intersection(R.keys(pkg.devDependencies), constants.supportedBoilerplates)
      .length > 0
  const addToIgnite = {
    npm_module: 'apollo',
    contextRequired: !!hasValidBoilerplate,
    component_location: hasValidBoilerplate
      ? '/src/views/'
      : '/App/Components'
  }

  if (hasValidBoilerplate) {
    // patch main.tsx
    ignite.patchInFile(`${process.cwd()}/src/app/main.ts`, {
      after: 'import { StorybookUIRoot } from "../../storybook"',
      insert: 'import ApolloClient from "apollo-boost"'
    })

    ignite.patchInFile(`${process.cwd()}/src/app/main.ts`, {
      after: 'import ApolloClient from "apollo-boost"',
      insert: 'const client = new ApolloClient({ uri: GRAPHQL_API })'
    })
    // patch environment-variables.ts, to ad URL endpoint
    ignite.patchInFile(`${process.cwd()}/src/app/environment-variables.ts`, {
      after: `declare var process: any`,
      insert: `\nexport const GRAPHQL_API: string | undefined = process.env.GRAPHQL_API`
    })
  }

  // Add filepaths to ignite.json, and write.
  let jsonToWrite = R.merge(igniteConfig, { graphql: addToIgnite })
  filesystem.write('./ignite/ignite.json', jsonToWrite, {jsonIndent: 2})

  // Example of copying templates/GraphqlMagic to App/GraphqlMagic
  // if (!filesystem.exists(`${APP_PATH}/App/GraphqlMagic`)) {
  //   filesystem.copy(`${PLUGIN_PATH}/templates/GraphqlMagic`, `${APP_PATH}/App/GraphqlMagic`)
  // }

  // Example of patching a file
  // ignite.patchInFile(`${APP_PATH}/App/Config/AppConfig.js`, {
  //   insert: `import '../GraphqlMagic/GraphqlMagic'\n`,
  //   before: `export default {`
  // })
}

/**
 * Remove yourself from the project.
 */
const remove = async function (context) {
  // Learn more about context: https://infinitered.github.io/gluegun/#/context-api.md
  // const { ignite, filesystem } = context
  // remove the npm module and unlink it
  // await ignite.removeModule(NPM_MODULE_NAME, { unlink: true })
  // Example of removing App/GraphqlMagic folder
  // const removeGraphqlMagic = await context.prompt.confirm(
  //   'Do you want to remove App/GraphqlMagic?'
  // )
  // if (removeGraphqlMagic) { filesystem.remove(`${APP_PATH}/App/GraphqlMagic`) }
  // Example of unpatching a file
  // ignite.patchInFile(`${APP_PATH}/App/Config/AppConfig.js`, {
  //   delete: `import '../GraphqlMagic/GraphqlMagic'\n`
  // )
}

// Required in all Ignite CLI plugins
module.exports = { add, remove }
