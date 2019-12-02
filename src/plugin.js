const isTargetChunk = require('./isTargetChunk')

const PluginName = 'DisableTreeShakingForChunkPlugin'

class DisableTreeShakingForChunkPlugin {
  constructor(options) {
    if (options.test) {
      this.test = options.test
    } else {
      throw Error('Expected a test option but received a falsy value')
    }
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(PluginName, (compilation) => {
      compilation.hooks.afterOptimizeChunkModules.tap(PluginName, (chunks) => {
        const targetChunks = chunks.filter((chunk) => isTargetChunk(chunk.name, this.test))

        targetChunks.forEach((targetChunk) => {
          targetChunk.modulesIterable.forEach((m) => {
            m.used = true
            m.usedExports = true
          })
        })
      })
    })
  }
}

module.exports = DisableTreeShakingForChunkPlugin
