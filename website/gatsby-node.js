const path = require('path')
const _ = require('lodash')

const siteConfig = require('./siteConfig')

console.log('---------------------------')
// const fetch = require('node-fetch')
exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  // const query = await Promise.resolve(require('./tsDocGen').data)
  const tempData = [
    {
      a: {
        b: 2,
        c: 3,
      },
    },
    {
      d: {
        e: 5,
      },
    },
  ]
  const query = await Promise.resolve(tempData)
  console.log(query)
  query.forEach((item, index) => {
    const nodeContent = JSON.stringify(item)
    const nodeMeta = {
      id: createNodeId(`react-base-table-ts-api-doc-${index}`),
      parent: null,
      children: [],
      internal: {
        type: `react-base-table-ts-api-doc`,
        content: nodeContent,
        contentDigest: createContentDigest(item),
      },
    }
    const node = Object.assign({}, item, nodeMeta)
    const { createNode } = actions
    // createNode(node)
  })
}

exports.onCreateWebpackConfig = ({ stage, getConfig, actions }) => {
  const config = getConfig()

  config.resolve.alias = {
    ...config.resolve.alias,
    assets: path.resolve(__dirname, 'src/assets'),
    components: path.resolve(__dirname, 'src/components'),
    utils: path.resolve(__dirname, 'src/utils'),
    siteConfig: path.resolve(__dirname, 'siteConfig'),
    'react-base-table/package.json': path.resolve(__dirname, '../package.json'),
    'react-base-table/styles.css': path.resolve(__dirname, '../styles.css'),
    'react-base-table': path.resolve(__dirname, '../src'),
  }

  actions.replaceWebpackConfig(config)
}

exports.onCreateNode = ({ node, actions, getNode, createNodeId }) => {
  const { createNodeField, createNode, createParentChildLink } = actions
  if (node.internal.type === 'MarkdownRemark') {
    let slug
    const fileNode = getNode(node.parent)
    if (!fileNode.relativePath) return

    const parsedFilePath = path.parse(fileNode.relativePath)
    if (parsedFilePath.name !== 'index' && parsedFilePath.dir !== '') {
      slug = `/${parsedFilePath.dir}/${parsedFilePath.name}`
    } else if (parsedFilePath.dir === '') {
      slug = `/${parsedFilePath.name}`
    } else {
      slug = `/${parsedFilePath.dir}`
    }
    slug = `/${fileNode.sourceInstanceName}${slug}`

    // Add slug as a field on the node.
    createNodeField({ node, name: 'slug', value: slug })
  } else if (
    node.internal.type === 'ComponentMetadata' &&
    node.methods.length
  ) {
    node.methods
      .filter(method => method.docblock)
      .map(method => {
        const methodNode = {
          id: createNodeId(`${node.id} >>> ${method.name}`),
          parent: node.id,
          children: [],
          name: method.name,
          params: method.params,
          description: method.description,
          internal: {
            type: `ComponentMethodExt`,
            mediaType: `text/markdown`,
            content: method.description,
            contentDigest: method.description,
          },
        }

        createNode(methodNode)
        createParentChildLink({ parent: node, child: methodNode })
      })
  }
}

exports.createPages = async ({ graphql, actions, getNode }) => {
  const { createPage } = actions

  const docPage = path.resolve('src/templates/doc.js')
  const apiPage = path.resolve('src/templates/api.js')
  const examplePage = path.resolve('src/templates/example.js')

  const result = await graphql(
    `
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
        allComponentMetadata {
          edges {
            node {
              parent {
                id
              }
              displayName
              docblock
            }
          }
        }
        allRawCode {
          edges {
            node {
              name
            }
          }
        }
      }
    `
  )
  if (result.errors) {
    throw new Error(result.errors)
  }

  result.data.allMarkdownRemark.edges.forEach(edge => {
    const slug = _.get(edge, 'node.fields.slug')
    if (!slug || !slug.includes('docs')) return
    createPage({
      path: slug,
      component: docPage,
      context: {
        slug,
      },
    })
  })

  result.data.allComponentMetadata.edges.forEach(edge => {
    const node = edge.node
    const fileNode = getNode(node.parent.id)
    if (fileNode.sourceInstanceName !== 'api') return
    const { displayName: name, docblock } = node
    if (!docblock) return
    createPage({
      path: `/api/${name.toLowerCase()}`,
      component: apiPage,
      context: {
        name,
      },
    })
  })

  result.data.allRawCode.edges.forEach(edge => {
    const name = edge.node.name
    createPage({
      path: `/examples/${name}`,
      component: examplePage,
      context: {
        name,
      },
    })
  })
}
