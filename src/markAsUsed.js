module.exports = (m, mg, rt) => {
  const ei = mg.getExportsInfo(m)
  ei.setUsedInUnknownWay(rt)
  if (m.factoryMeta === undefined) {
    m.factoryMeta = {}
  }
  m.factoryMeta.sideEffectFree = false
}
