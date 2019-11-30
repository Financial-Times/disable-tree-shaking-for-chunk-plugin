const webpack = require('webpack')
const loadFile = require('./helpers/loadFile')
const config = require('./fixtures/webpack.config')

describe('Webpack plugin test', () => {
  let result

  beforeAll((done) => {
    webpack(config, (errors, stats) => {
      result = { errors, stats }
      done()
    })
  })

  it('builds without errors', () => {
    expect(result.errors).toBe(null)
    expect(result.stats.hasErrors()).toBe(false)
  })

  it('generates all chunks', () => {
    const chunks = result.stats.compilation.chunks.map((chunk) => chunk.name)

    expect(chunks).toContain('external-lib-one')
    expect(chunks).toContain('external-lib-two')

    expect(chunks).toContain('module-a')
    expect(chunks).toContain('module-b')
  })

  describe('in target chunks', () => {
    it('disables tracking of exports for each module', () => {
      const chunks = result.stats.compilation.chunks.filter((chunk) => /^external-/.test(chunk.name))

      chunks.forEach((chunk) => {
        chunk.modulesIterable.forEach((m) => {
          expect(m.usedExports).toBe(true)
        })
      })
    })

    it('prevents Webpack dropping any exports', () => {
      const one = loadFile('external-lib-one.js')
      const two = loadFile('external-lib-two.js')

      expect(one).not.toContain('unused harmony export')
      expect(two).not.toContain('unused harmony export')
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
  })
})
