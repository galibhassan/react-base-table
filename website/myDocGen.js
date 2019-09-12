const path = require('path')
const fs = require('fs')
const data = fs.readFileSync(
  path.resolve(__dirname, '_build', '_doc', 'docInfo.json'),
  'utf8'
)

const myHtml = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>lala</title>
  <style>
    * {
      font-family: Arial, Helvetica, sans-serif;
    }
    body{
      margin: 50px;
      padding: 20px;
      box-shadow: 1px 1px 10px 1px rgba(0,0,0,0.2);
    }
    h2{
      color: rgb(116, 122, 120);
    }
    h4{
      margin-left: 10px;
    }
    .prop{
      margin-left: 20px;
      color: rgb(230, 123, 24);
    }
    .propDescription {
      color: rgb(90, 146, 184);
      font-size: .9rem
    }
    .propType {
      font-family: 'consolas'
    }
  </style>
</head>
<body>

  <script>
    var data = ${data}
    var myDiv = document.createElement('div');
    myDiv.id = 'myDiv';
    data.map(item => {
      myDiv.innerHTML +=
        '<div>' +
        '<h2>' + item.displayName + '</h2>' +
        '<h3>' + 'props' + '</h3>' +
        Object.keys(item.props).map(prop => {
          return '<span class="prop">' + prop  +'</span>'+ ': ' + '<span class="propType">' + item.props[prop].type.name + '</span>' + ' (' + '<span class="propDescription">' + item.props[prop].description + '</span>' + ')' +
          '<br/>'
        }) +
      '</div>' + 
      '<br/>' + 
      '<hr/>'
    })
    document.body.appendChild(myDiv);
  </script>
</body>

</html>

`

fs.writeFileSync(
  path.resolve(__dirname, '_build', '_doc', 'sampleDOC.html'),
  myHtml
)

console.log('documentation generated in')
console.log(path.resolve(__dirname, '_build', '_doc', 'sampleDOC.html'))
