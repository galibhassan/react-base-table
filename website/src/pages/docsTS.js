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
                    <em>{propDetail.description}</em>
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
            age {
              parent {
                fileName
                name
              }
              type {
                name
              }
              description
              name
              required
            }
            house {
              description
              name
              parent {
                fileName
                name
              }
              required
              type {
                name
              }
            }
            name {
              description
              name
              parent {
                fileName
                name
              }
              required
              type {
                name
              }
            }
          }
        }
        _1 {
          description
          displayName
          props {
            age {
              parent {
                fileName
                name
              }
              type {
                name
              }
              description
              name
              required
            }
            canFly {
              parent {
                fileName
                name
              }
              type {
                name
              }
              description
              name
              required
            }
            canVanish {
              parent {
                fileName
                name
              }
              type {
                name
              }
              description
              name
              required
            }
            house {
              type {
                name
              }
              description
              name
              parent {
                fileName
                name
              }
              required
            }
            name {
              description
              name
              required
              parent {
                fileName
                name
              }
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
