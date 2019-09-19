const path = require('path')
const cp = require('child_process')

const findFileWithExtension = ext => {
  const pathWebsite_pwd = cp.execSync('pwd', { encoding: 'utf-8' })
  const pathToReactBaseTableSrc_pwd =
    pathWebsite_pwd.split('website')[0] + 'src'
  var command = `find ${pathToReactBaseTableSrc_pwd} -name *.${ext}`
  const filesWithExt = cp.execSync(command, { encoding: 'utf-8' })
  const filesWithExtArr = filesWithExt.split('\n')

  const outArr = []
  for (let i = 0; i < filesWithExtArr.length - 1; i++) {
    const filesWithExtArr_dirString = path.resolve(
      __dirname,
      '../',
      'src',
      filesWithExtArr[i].split('src/')[1]
    )
    outArr.push(filesWithExtArr_dirString)
  }
  return outArr
}

console.log(findFileWithExtension('tsx'))

let tsxParser = require('react-docgen-typescript')
// See if there is a tsconfig.json; if so, use that
try {
  tsxParser = tsxParser.withDefaultConfig({
    propFilter(prop) {
      if (prop.parent) {
        return !prop.parent.fileName.includes('node_modules')
      }
      return true
    },
  })
} catch (err) {}

const pathToFiles = findFileWithExtension('tsx')
const data = tsxParser.parse(pathToFiles)

module.exports = {
  data,
}
