'phantom image: web-node:v1'
'phantombuster command: nodejs'
'phantombuster dependencies: lib-common.js, lib-recipe-supplier.js'
'phantombuster flags: save-folder'

const Buster = require('phantombuster')
const buster = new Buster()

;(async () => {
  const { main } = await import('./common')
  await main(buster)
})()
