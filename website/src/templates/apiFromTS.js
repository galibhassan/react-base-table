import * as React from 'react'

export default class ApiFromTs extends React.Component {
  render() {
    const { pageProps } = this.props.pageContext
    return (
      <div>
        <div style={{ marginLeft: '200px' }}>
          {pageProps.map(item => {
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
                <br />
                <br />
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
