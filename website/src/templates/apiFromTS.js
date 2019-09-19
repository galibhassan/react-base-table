import * as React from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

export default class ApiFromTs extends React.Component {
  render() {
    const { pageProps } = this.props.pageContext

    const links = []
    pageProps.map(item => {
      const tempLink = {
        key: item.displayName,
        to: `/docTS/#${item.displayName}`,
        title: item.displayName,
        external: undefined,
      }
      links.push(tempLink)
    })

    return (
      <div>
        <Header />

        <div
          style={{
            marginLeft: '150px',
            marginTop: '100px',
          }}
        >
          <Sidebar links={links} />
          <div
            style={{
              marginLeft: '250px',
              marginRight: '100px',
              marginTop: '100px',
            }}
          >
            {pageProps.map(item => {
              return (
                <div id={item.displayName}>
                  <br />
                  <br />
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
                            {propDetail.required === true
                              ? 'Required'
                              : 'Optional'}
                          </samp>{' '}
                          <br />
                          <em>{propDetail.description}</em>
                          <br />
                          <br />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}
