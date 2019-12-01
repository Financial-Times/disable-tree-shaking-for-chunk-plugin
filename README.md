# Disable Tree Shaking For Chunk Plugin

This plugin for [Webpack] can disable tree shaking for all modules contained in a specific chunk. It is intended to help improve long-term caching and code reuse between project installations and builds.

[Webpack]: https://webpack.js.org/


## Installation

This is a [Node.js] module available through the [npm] registry. Node 8 and Webpack 4.38 or higher are required.

Installation is done using the [npm install] command:

```sh
$ npm install --save-dev disable-tree-shaking-for-chunk-plugin
```

Once installed the plugin can be added to your [Webpack plugins configuration][plugins]:

```js
const DisableTreeShakingForChunk = require('disable-tree-shaking-for-chunk-plugin')

module.exports = {
  //...
  plugins: [
    new DisableTreeShakingForChunk({
      test: 'chunk-name'
    })
  ]
}
```

[Node.js]: https://nodejs.org/
[npm]: http://npmjs.com/
[npm install]: https://docs.npmjs.com/getting-started/installing-npm-packages-locally
[plugins]: https://webpack.js.org/configuration/plugins/
[optimization]: https://webpack.js.org/configuration/optimization/#optimizationmoduleids


## Options

### `test` (string, RegExp, Function)

Matches the chunk name. It may be a string matched with strict equality, a regular expression for more complex string matching, or a function which will receive the chunk name as an argument and should return a boolean.


## Development

This project uses [Prettier] for automatic code formatting and is tested with [Jasmine].

[Prettier]: https://prettier.io/
[Jasmine]: http://jasmine.github.io/


## License

This package is [MIT] licensed.

[MIT]: https://opensource.org/licenses/MIT