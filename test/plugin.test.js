const webpack = require('webpack')
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
    const chunks = result.stats.compilation.chunks.map((chunk) => chunk.name)

    expect(chunks).toContain('external-utils')
    expect(chunks).toContain('external-component')

    expect(chunks).toContain('module-a')
    expect(chunks).toContain('module-b')
  })

  describe('in target chunks', () => {
    it('disables tracking of exports for each module', () => {
      const chunks = result.stats.compilation.chunks.filter((chunk) => /^external-/.test(chunk.name))

      chunks.forEach((chunk) => {
        chunk.modulesIterable.forEach((m) => {
          expect(m.usedExports).toBe(true)

          if (m.rootModule) {
            expect(m.rootModule.usedExports).toBe(true)
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

      expect(one).toContain('__webpack_exports__, "debounce"')
      expect(one).toContain('__webpack_exports__, "throttle"')
      expect(one).toContain('__webpack_exports__, "broadcast"')
      expect(two).toContain('__webpack_exports__, "default"')
    })
  })

  describe('in other chunks', () => {
    it('does not disable tracking', () => {
      const chunks = result.stats.compilation.chunks.filter((chunk) => !/^external-/.test(chunk.name))

      chunks.forEach((chunk) => {
        chunk.modulesIterable.forEach((m) => {
          // An entry module has no exports so ignore it
          if (!m.isEntryModule()) {
            expect(Array.isArray(m.usedExports)).toBe(true)
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
