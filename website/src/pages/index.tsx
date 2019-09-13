import * as React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'

import Page from 'components/Page'

const Container = styled(Page).attrs({ full: true })`
  padding: 0;
`

const Hero = styled.div`
  background-color: #182a3d;
  color: #fff;
  padding: 10rem;
  text-align: center;
`

const Description = styled.p`
  color: #bcc9d1;
  max-width: 60rem;
  margin: 2rem auto 4rem;
`

const Content = styled.div`
  margin: 0 auto;
  max-width: 96rem;
  padding: 2rem;
  position: relative;
`

const StyledLink = styled(Link)`
  display: block;
  margin-top: 1rem;
  font-size: 1.8rem;
  font-weight: 500;
`

const ExternalLink = StyledLink.withComponent('a')

const StartLink = styled(Link)`
  background-color: #0696d7;
  color: #fff;
  padding: 0.5em 1em;
  border-radius: 0.2em;
  &:hover {
    background-color: #fff;
  }
`

const ExampleLink = styled(StartLink)`
  background-color: transparent;
  &:hover {
    background-color: transparent;
  }
`

/**
 * interface for human
 */
export interface IHumanProps {
  /**
   * name of the person
   */
  name: string;
  /**
   * age of the person
   */
  age: number;
  /**
   * Hogwarts house
   */
  house: string;
}
/**
 * Interface for super-humans
 */
interface ISuperHumanProps extends IHumanProps {
  /**
   * Flying ability
   */
  canFly: boolean;
  /**
   * Vanishing ability
   */
  canVanish: boolean;
}

/**
 * The Human Class
 */
export class Human extends React.Component<IHumanProps, {}> {
  public render() {
    return(
      <div>
        Hello from Human class
      </div>
    )
  }
}

/**
 * The Super Human class
 */
export class SuperHuman extends React.Component<ISuperHumanProps, {}> {
  /**
   * getter for name
   */
  public getName() {
    return 'name of this'
  }
  public render() {
    return(
      <div>
        <Human name={'harry potter'} age={30} house="Gryffindor"/>
      </div>
    )
  }
}

export default () => (
  <Container title="Home">
    <Hero>
      <h1>BaseTable</h1>
      <Description>
        BaseTable is a react table component to display large data set with high
        performance and flexibility
      </Description>
      <StartLink to="/docs">Get Started</StartLink>
      <ExampleLink to="/examples">View Examples</ExampleLink>
    </Hero>
    <Content>
      <StyledLink to="/docs">Docs</StyledLink>
      <StyledLink to="/api">API</StyledLink>
      <StyledLink to="/examples">Examples</StyledLink>
      <ExternalLink
        href="https://autodesk.github.io/react-base-table/"
        rel="noopener noreferrer"
        target="_blank"
      >
        Github
      </ExternalLink>
    </Content>
  </Container>
)
