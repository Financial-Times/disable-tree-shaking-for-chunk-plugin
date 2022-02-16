module.exports = (module, moduleGraph, runtime) => {
  const exportsInfo = moduleGraph.getExportsInfo(module)
  exportsInfo.setUsedInUnknownWay(runtime)
  if (module.factoryMeta === undefined) {
    module.factoryMeta = {}
  }
  module.factoryMeta.sideEffectFree = false
}
