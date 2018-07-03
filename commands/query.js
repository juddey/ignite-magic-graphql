// @cliDescription  Example GraphqlMagic command
// Generates a Query Component
const R = require('ramda')

module.exports = async function (context) {
  // Learn more about context: https://infinitered.github.io/gluegun/#/context-api.md
  const { parameters, strings, print, ignite } = context
  const { isBlank, isNotString } = strings
  const igniteConfig = ignite.loadIgniteConfig()

  // validation
  if (R.isNil(R.prop('graphql', igniteConfig))) {
    print.info(`Couldn't load the ignite graphql key!`)
    return
  }

  if (isBlank(parameters.first)) {
    print.info(`ignite generate query <name> <domain>\n`)
    print.info('Name is required.')
    return
  }

  if (
    R.not(parameters.second) ||
    (igniteConfig.graphql.contextRequired &&
      (isBlank(parameters.second) || isNotString(parameters.second)))
  ) {
    print.info(`ignite generate query <name> <domain>\n`)
    print.info('Domain is required.')
    return
  }

  const name = parameters.first

  const location = igniteConfig.graphql.contextRequired
    ? igniteConfig.graphql.component_location + parameters.second
    : parameters.second
  const props = { name: name }

  // Copy Query Template
  const jobs = [
    {
      template: 'query.js.ejs',
      target: `${location}/${name}.query.js`
    }
  ]

  // make the templates and pass in props with the third argument here
  await ignite.copyBatch(context, jobs, props)
}
