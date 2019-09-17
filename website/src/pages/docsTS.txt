import React from 'react'
// import { Redirect } from '@reach/router'
// import { withPrefix } from 'gatsby-link'
import { graphql, useStaticQuery } from 'gatsby'

import Page from 'components/Page'

const tsApiDoc = tsDocGenArray => {
  return (
    <div>
      {tsDocGenArray.map(item => {
        return (
          <div>
            <h1>{item.displayName}</h1>
            <p>{item.description}</p>
            <h3>Props</h3>
            <div>
              {Object.keys(item.props).map((prop, propindex) => {
                const propDetail = item.props[prop]
                return (
                  <div>
                    <span
                      style={{
                        fontWeight: 500,
                        marginRight: '15px',
                      }}
                    >
                      {propDetail.name}{' '}
                    </span>
                    <code> {propDetail.type.name} </code>
                    <samp>
                      {propDetail.required === true ? 'Required' : 'Optional'}
                    </samp>{' '}
                    <br />
                    <em>{propDetail.description}</em>
                    <br />
                    <br />
                  </div>
                )
              })}
            </div>
            <br />
            <br />
          </div>
        )
      })}
    </div>
  )
}

export default () => {
  const tsDocGenData = useStaticQuery(tsDocGenGraphqlQuery)
  const tsDocGenArray = Object.values(tsDocGenData.allTsDocGen.nodes[0])
  return (
    <Page title="apiTypescript">
      <p>API generated from typescript</p>
      {tsApiDoc(tsDocGenArray)}
    </Page>
  )
}

const tsDocGenGraphqlQuery = graphql`
  query MyQuery {
    allTsDocGen {
      nodes {
        _0 {
          description
          displayName
          props {
            align {
              description
              name
              required
              type {
                name
              }
            }
            cellRenderer {
              description
              name
              required
              type {
                name
              }
            }
            className {
              description
              name
              type {
                name
              }
              required
            }
            dataGetter {
              description
              name
              required
              type {
                name
              }
            }
            dataKey {
              description
              name
              required
              type {
                name
              }
            }
            flexGrow {
              description
              name
              required
              type {
                name
              }
            }
            flexShrink {
              description
              name
              required
              type {
                name
              }
            }
            frozen {
              description
              name
              required
              type {
                name
              }
            }
            headerClassName {
              description
              name
              required
              type {
                name
              }
            }
            headerRenderer {
              description
              name
              required
              type {
                name
              }
            }
            hidden {
              description
              name
              required
              type {
                name
              }
            }
            key {
              description
              name
              required
              type {
                name
              }
            }
            maxWidth {
              description
              name
              required
              type {
                name
              }
            }
            minWidth {
              description
              name
              required
              type {
                name
              }
            }
            resizable {
              description
              name
              required
              type {
                name
              }
            }
            sortable {
              description
              name
              required
              type {
                name
              }
            }
            style {
              description
              name
              required
              type {
                name
              }
            }
            title {
              description
              name
              required
              type {
                name
              }
            }
            width {
              description
              name
              required
              type {
                name
              }
            }
          }
        }
      }
    }
  }
`
