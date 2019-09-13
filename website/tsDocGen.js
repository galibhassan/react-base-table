const path = require('path')
const fs = require('fs')

let tsxParser = require('react-docgen-typescript')
// See if there is a tsconfig.json; if so, use that
try {
  // tsxParser = tsxParser.withCustomConfig('./tsconfig.json')
  tsxParser = tsxParser.withDefaultConfig()
} catch (err) {}

const pathToFile = path.resolve(__dirname, 'src', 'pages', 'index.tsx')
const data = tsxParser.parse(pathToFile)

module.exports = {
  data,
}
/* 
fs.writeFileSync(
  `${__dirname}/_build/_doc/docInfo.json`,
  JSON.stringify(data, null, 2)
)
*/
