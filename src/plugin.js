"use strict"

const ConcatenatedModule = require('webpack/lib/optimize/ConcatenatedModule')
const { mergeRuntimeOwned, getEntryRuntime } = require('webpack/lib/util/runtime')
const isTargetChunk = require('./isTargetChunk')
const markAsUsed = require('./markAsUsed')

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
      const { moduleGraph } = compilation
      compilation.hooks.afterOptimizeChunkModules.tap(PluginName, (chunks) => {
        const targetChunks = Array.from(chunks).filter((chunk) =>
          isTargetChunk(chunk.name, this.test)
        )
        let runtime = undefined
        for (const [name, { options }] of compilation.entries) {
          runtime = mergeRuntimeOwned(runtime, getEntryRuntime(compilation, name, options))
        }

        targetChunks.forEach((targetChunk) => {
          compilation.chunkGraph.getChunkModulesIterable(targetChunk).forEach((module) => {
            if (module.type.startsWith('javascript/')) {
              markAsUsed(module, moduleGraph, runtime)

              if (module instanceof ConcatenatedModule) {
                markAsUsed(module.rootModule, moduleGraph, runtime)
              }
            }
          })
        })
      })
    })
  }
}

module.exports = DisableTreeShakingForChunkPlugin
