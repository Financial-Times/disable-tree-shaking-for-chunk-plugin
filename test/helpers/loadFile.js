const fs = require('fs')
const path = require('path')

module.exports = (file) => String(fs.readFileSync(path.join('./test/temp', file)))
