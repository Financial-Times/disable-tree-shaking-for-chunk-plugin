const subject = require('../src/isTargetChunk')

describe('src/isTargetChunk', () => {
  it('supports test as a string', () => {
    expect(subject('foo', 'foo')).toBe(true)
  })

  it('supports test as a RegExp', () => {
    expect(subject('foo', /^foo$/)).toBe(true)
  })

  it('supports test as a function', () => {
    expect(subject('foo', () => true)).toBe(true)
  })

  it('supports test as an array', () => {
    expect(subject('foo', ['foo'])).toBe(true)
  })

  it('supports test as a Set', () => {
    expect(subject('foo', new Set(['foo']))).toBe(true)
  })

  it('throws an error for unexpected test types', () => {
    expect(() => subject('foo', new Map())).toThrowError()
  })
})
