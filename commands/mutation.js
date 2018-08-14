// @cliDescription Generates a Mutation Component
const helpers = require('../helpers')

module.exports = async function (context) {
  // Learn more about context: https://infinitered.github.io/gluegun/#/context-api.md
  const { parameters, ignite, strings } = context
  const { pascalCase } = strings
  const igniteConfig = ignite.loadIgniteConfig()

  // validation
  if (helpers.invalid(context, igniteConfig)) {
    return
  }

  const name = parameters.first
  const location = helpers.filePath(igniteConfig, parameters)
  const pascalName = pascalCase(name)
  const props = { name: name, pascalName: pascalName }

  // Copy Mutation Template
  const jobs = [
    {
      template: 'mutation.js.ejs',
      target: `${location}/${name}.mutation.js`
    }
  ]

  // make the templates and pass in props with the third argument here
  await ignite.copyBatch(context, jobs, props)
}
