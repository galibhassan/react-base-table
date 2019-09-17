const path = require('path')

let tsxParser = require('react-docgen-typescript')
// See if there is a tsconfig.json; if so, use that
try {
  tsxParser = tsxParser.withDefaultConfig()
} catch (err) {}

const pathToFile = path.resolve(__dirname, 'src', 'pages', 'index.tsx')
const data = tsxParser.parse(pathToFile)

module.exports = {
  data,
}
