module.exports = (name, test) => {
  if (typeof test === 'function') {
    return test(name)
  }

  if (test instanceof RegExp) {
    return test.test(name)
  }

  if (typeof test === 'string') {
    return test === name
  }
}
