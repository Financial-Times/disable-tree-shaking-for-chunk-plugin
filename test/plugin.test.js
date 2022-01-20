const webpack = require('webpack')
const { mergeRuntimeOwned, getEntryRuntime } = require('webpack/lib/util/runtime')
const NormalModule = require('webpack/lib/NormalModule')
const loadFile = require('./helpers/loadFile')
const config = require('./fixtures/webpack.config')

describe('src/plugin', () => {
  let result

  beforeAll((done) => {
    webpack(config, (errors, stats) => {
      result = { errors, stats }

      if (errors || stats.hasErrors()) {
        console.error(errors || stats.toJson().errors.join('\n'))
      }

      done()
    })
  })

  it('builds without errors', () => {
    expect(result.errors).toBe(null)
    expect(result.stats.hasErrors()).toBe(false)
  })

  it('generates all chunks', () => {
    const chunks = Array.from(result.stats.compilation.chunks).map((chunk) => chunk.name)

    expect(chunks).toContain('external-utils')
    expect(chunks).toContain('external-component')

    expect(chunks).toContain('module-a')
    expect(chunks).toContain('module-b')
  })

  describe('in target chunks', () => {
    it('disables tracking of exports for each module', () => {
      const { compilation } = result.stats
      const { moduleGraph } = compilation
      const chunks = Array.from(compilation.chunks).filter((chunk) => /^external-/.test(chunk.name))

      runtime = getEntryRuntime(compilation, 'scripts', compilation.entries.get('scripts').options)

      chunks.forEach((chunk) => {
        compilation.chunkGraph.getChunkModulesIterable(chunk).forEach((m) => {
          const ei = moduleGraph.getExportsInfo(m)
          expect(ei.getUsedExports(runtime)).toBe(true)

          if (m.rootModule) {
            const rei = moduleGraph.getExportsInfo(m.rootModule)
            expect(rei.getUsedExports(runtime)).toBe(true)
          }
        })
      })
    })

    it('prevents Webpack dropping any exports', () => {
      const one = loadFile('external-utils.js')
      const two = loadFile('external-component.js')

      expect(one).not.toContain('unused harmony export')
      expect(two).not.toContain('unused harmony export')
    })

    it('prevents export names from being mangled', () => {
      const one = loadFile('external-utils.js')
      const two = loadFile('external-component.js')

      expect(one).toContain('/* harmony export */   "debounce"')
      expect(one).toContain('/* harmony export */   "throttle"')
      expect(one).toContain('/* harmony export */   "broadcast"')
      expect(two).toContain('/* harmony export */   "default"')
    })
  })

  describe('in other chunks', () => {
    it('does not disable tracking', () => {
      const { compilation } = result.stats
      const { moduleGraph } = compilation
      const chunks = Array.from(compilation.chunks).filter(
        (chunk) => !/^external-/.test(chunk.name)
      )

      runtime = getEntryRuntime(compilation, 'scripts', compilation.entries.get('scripts').options)
      chunks.forEach((chunk) => {
        compilation.chunkGraph.getChunkModulesIterable(chunk).forEach((m) => {
          // An entry module has no exports so ignore it
          if (m instanceof NormalModule && !compilation.chunkGraph.isEntryModule(m)) {
            const ei = moduleGraph.getExportsInfo(m)
            expect(ei.getUsedExports(runtime)).toBeInstanceOf(Set)
          }
        })
      })
    })

    it('allows Webpack to drop unused exports', () => {
      const a = loadFile('module-a.js')
      const b = loadFile('module-b.js')

      expect(a).toContain('unused harmony export')
      expect(b).toContain('unused harmony export')
    })

    it('allows export names to be mangled', () => {
      const utils = loadFile('external-utils.js')

      expect(utils).not.toContain('__webpack_exports__, "a1"')
      expect(utils).not.toContain('__webpack_exports__, "b2"')
    })
  })
})
