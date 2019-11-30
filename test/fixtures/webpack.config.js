const path = require('path')
const Subject = require('../../')

const instance = new Subject({ test: /^external-/ })

module.exports = {
  mode: 'production',
  entry: {
    scripts: path.join(__dirname, 'entry-point.js')
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../temp')
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        splitOnExternals: {
          test: (m) => m.resource.includes('external-'),
          name: (m) => m.resource.substr(m.resource.lastIndexOf('external-')).replace(/\.js$/, ''),
          enforce: true
        },
        splitOnModules: {
          test: (m) => m.resource.includes('module-'),
          name: (m) => m.resource.substr(m.resource.lastIndexOf('module-')).replace(/\.js$/, ''),
          enforce: true
        }
      }
    },
    minimize: false
  },
  plugins: [instance],
  devtool: false
}
