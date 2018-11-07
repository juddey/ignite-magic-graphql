// Ignite CLI plugin for GraphqlMagic
// ----------------------------------------------------------------------------

const constants = require('./constants')
const R = require('ramda')

// const PLUGIN_PATH = __dirname
// const APP_PATH = process.cwd()

const add = async function (context) {
  // Learn more about context: https://infinitered.github.io/gluegun/#/context-api.md
  const { ignite, filesystem, print, parameters, prompt } = context
  const pkg = filesystem.read('package.json', 'json')
  const igniteConfig = ignite.loadIgniteConfig()
  const questions = {
    name: 'setup',
    type: 'list',
    message: 'Would you like apollo-boost, or custom config?',
    choices: ['boost', 'custom']
  }

  let answers
  if (parameters.options.boost) {
    answers = { setup: 'boost' }
  } else if (parameters.options.custom) {
    answers = { setup: 'custom' }
  } else {
    answers = await prompt.ask(questions)
  }

  const setupAnswer = answers['setup']
  const NPM_MODULES =
    setupAnswer === 'boost'
      ? constants.APOLLO_NPM_MODULES
      : constants.CUSTOM_NPM_MODULES

  // installeth the npm modules
  for (const x of NPM_MODULES) {
    await ignite.addModule(x.package, x.options)
  }

  const devDependencies = R.keys(pkg.devDependencies)
  const hasValidBoilerplate =
    R.intersection(devDependencies, constants.supportedBoilerplates).length > 0
  const feature = R.path(['ignite-base-plate', 'format']) === 'feature'
  const funct = R.path(['ignite-base-plate', 'format']) === 'function'  

  const addToIgnite = {
    npm_module: 'apollo',
    contextRequired: !!hasValidBoilerplate,
    component_location: hasValidBoilerplate && feature ? "/src/views/" : "/App/Components"
  }

  if (hasValidBoilerplate) {
    if (devDependencies.includes('ignite-ir-boilerplate-bowser')) {
      // Add the import for apollo provider.
      ignite.patchInFile(`${process.cwd()}/src/app/setup-root-store.ts`, {
        after: `import { Api } from "../services/api"`,
        insert: `import * as env from "../app/environment-variables"`
      })

      ignite.patchInFile(`${process.cwd()}/src/app/setup-root-store.ts`, {
        after: `import { Api } from "../services/api"`,
        insert: `import { ApolloProvider } from "react-apollo"`
      })

      ignite.patchInFile(`${process.cwd()}/src/app/setup-root-store.ts`, {
        after: `env.api = new Api()`,
        insert: `env.graphql = new ApolloClient({ uri: env.GRAPHQL_API })`
      })

      // patch environment-variables.js, to add URL endpoint
      ignite.patchInFile(`${process.cwd()}/src/app/environment-variables.ts`, {
        after: `export const API = process.env.API`,
        insert: `\nexport const GRAPHQL_API = process.env.GRAPHQL_API`
      })

      try {
        ignite.patchInFile(`${process.cwd()}/.babelrc`, {
          replace: `        "include": ["NODE_ENV", "API"]`,
          insert: `        "include": ["NODE_ENV", "API", "GRAPHQL_API"]`
        })
      } catch (error) {
        print.info("Couldn't patch .babelrc. Add GRAPHQL_API to")
        print.info('babel-transform-inline-env-variables, "include" array.')
      }
    } else {
      // TODO Support "function" different file paths.
      // copy the Apollo HOC to the app directory
      const jobs = [
        {
          template:
            setupAnswer === 'boost'
              ? 'BoostApolloHoc.js.ejs'
              : 'CustomApolloHoc.js.ejs',
          target: feature ? `./src/app/ApolloHoc.js` : `./src/App/ApolloHoc.js`
        }
      ]

      // make the templates and pass in props
      await ignite.copyBatch(context, jobs, null, { quiet: true })

      const navPath = feature ? `navigation` : `Navigation`
      if (igniteConfig.navigation === 'react-native-navigation') {
        // Patch the ScreenRegistry
        ignite.patchInFile(
          `${process.cwd()}/src/${navPath}/ScreenRegistry.js`,
          {
            after: `import { Navigation } from 'react-native-navigation'`,
            insert: feature ? `import ApolloHOC from '../app/ApolloHoc'` : `import ApolloHOC from '../src/App/ApolloHoc'`
          }
        )

        print.info(
          'Added Hoc to Screen Registry. Wrap your components in the Apollo HOC.'
        )
      }

      try {
        ignite.patchInFile(`${process.cwd()}/.env`, {
          after: `# Environment Variables`,
          insert: `GRAPHQL_API=http://localhost:4000/api\n`
        })
      } catch (error) {
        print.info("Couldn't patch .env. Add GRAPHQL_API manually.")
      }
    }
  }

  // Add filepaths to ignite.json, and write.
  let jsonToWrite = R.merge(igniteConfig, { graphql: addToIgnite })
  filesystem.write('./ignite/ignite.json', jsonToWrite, { jsonIndent: 2 })
  // Example of copying templates/GraphqlMagic to App/GraphqlMagi  // if (!filesystem.exists(`${APP_PATH}/App/GraphqlMagic`)) {
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
