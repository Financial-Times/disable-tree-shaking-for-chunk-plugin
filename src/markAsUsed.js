module.exports = (module, moduleGraph, runtime) => {
  const exportsInfo = moduleGraph.getExportsInfo(module)
  exportsInfo.setUsedInUnknownWay(runtime)
}
