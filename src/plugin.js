const isTargetChunk = require('./isTargetChunk')

const PluginName = 'DisableTreeShakingForChunkPlugin'

class DisableTreeShakingForChunkPlugin {
  constructor(options) {
    this.options = Object.assign({}, options)
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(PluginName, (compilation) => {
      compilation.hooks.afterOptimizeChunkModules.tap(PluginName, (chunks) => {
        const targetChunks = chunks.filter((chunk) => isTargetChunk(chunk.name, this.options.test))

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
