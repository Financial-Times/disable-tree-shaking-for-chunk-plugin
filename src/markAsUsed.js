module.exports = (m) => {
  m.used = true

  // console.log({
  //   usedExports: m.usedExports,
  //   providedExports: m.buildMeta.providedExports
  // })

  if (Array.isArray(m.usedExports) && Array.isArray(m.buildMeta.providedExports)) {
    m.usedExports = [...m.buildMeta.providedExports]
  } else {
    m.usedExports = true
    m.buildMeta.providedExports = true
  }
}
