# ignite-magic-graphql

Add some graphql magic :sparkles: to your ignite project.

This plugin adds support for apollo client @ v2.1 through `apollo-boost` and `react-apollo`.

```js
ignite add ignite-magic-graphql
```
## Generators
Generators take two parameters: 

* `name` - the name of the component file you want to generate
* `domain` - for bowser-esque boilerplates. This the directory where your component is located, minus the `.src/views/` path. For all other boilerplates, this will default to `./App/Components/`.

You can change the component location in the ignite.json file.

with that read, you should be able to: ignite g....
```js
  query <name> <domain>
  mutation <name> <domain>  
```
and have some fun. Enjoy!

### FAQ

* I'm curious about the modules that are installed. Is there a list? <br>
[This way, please](https://github.com/juddey/ignite-magic-graphql/blob/master/constants.js#L2).

### License 
MIT Justin Lane 2018.
