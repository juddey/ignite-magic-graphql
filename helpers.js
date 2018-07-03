const R = require('ramda')

const invalid = (context, igniteConfig) => {
  const { parameters, strings, print } = context
  const { isBlank, isNotString } = strings

  if (R.isNil(R.prop('graphql', igniteConfig))) {
    print.info(`Couldn't load the ignite graphql key!`)
    return true
  }

  if (isBlank(parameters.first)) {
    print.info(`ignite generate query <name> <domain>\n`)
    print.info('Name is required.')
    return true
  }

  if (
    R.not(parameters.second) ||
    (igniteConfig.graphql.contextRequired &&
      (isBlank(parameters.second) || isNotString(parameters.second)))
  ) {
    print.info(`ignite generate query <name> <domain>\n`)
    print.info('Domain is required.')
    return true
  }
}

module.exports = { invalid }
