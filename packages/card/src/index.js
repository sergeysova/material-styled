import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'

import Button from '@material-styled/button'

import { shadows } from '@material-styled/shadow'

import { ifProp } from '@material-styled/theming'


/**
 *
 */
export const CardHeader = styled.div`
  padding: 16px;

  ${ifProp('flex', 'display: flex;', 'display: block;')}
  ${ifProp('column', 'flex-direction: column;')}

  h1,h2 {
    color: rgba(0, 0, 0, 0.87);
  }

  h1 {
    padding-top: 8px;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-smoothing: antialiased;
    font-size: 1.5rem;
    font-weight: 400;
    letter-spacing: normal;
    line-height: 2rem;
    text-decoration: inherit;
    text-transform: inherit;
    margin: 0;
  }

  h2 {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-smoothing: antialiased;
    font-size: 0.875rem;
    font-weight: 400;
    letter-spacing: 0.04em;
    line-height: 1.25rem;
    text-decoration: inherit;
    text-transform: inherit;
    color: rgba(0, 0, 0, 0.87);
    margin: -.063rem 0;
  }
`
CardHeader.propTypes = {
  flex: PropTypes.bool,
  column: PropTypes.bool,
}
CardHeader.defaultProps = {
  flex: false,
  column: false,
}

/**
 *
 */
export const CardText = styled.div`
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-smoothing: antialiased;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  line-height: 1.25rem;
  text-decoration: inherit;
  text-transform: inherit;
  color: rgba(0, 0, 0, 0.87);
  box-sizing: border-box;
  padding: 8px 16px;
`

/**
 *
 */
export const CardActions = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 8px;

  & ${Button} {
    margin: 0 8px 0 0;
  }
`

/**
 *
 */
export const CardMediaImage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
  padding: 16px;
  height: ${p => p.height ? `${p.height}rem` : '12rem'};

  ${ifProp('image', css`
    background-image: url(${p => p.image});
    background-size: cover;
    background-repeat: no-repeat;
  `)}
`
CardMediaImage.propTypes = {
  image: PropTypes.string,
  height: PropTypes.number,
}

/**
 *
 */
export const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  user-select: none;
  color: black;

  border-radius: 2px;
  padding: 0;
  overflow: hidden;

  box-shadow: ${shadows[1]};
  ${p => p.maxWidth
    ? `max-width: ${p.maxWidth}rem;`
    : ''}
  ${ifProp('wide', 'width: 100%;')}
`

Card.propTypes = {
  header: PropTypes.node,
  maxWidth: PropTypes.number,
  wide: PropTypes.bool,
}

Card.defaultProps = {
  header: null,
  maxWidth: undefined,
  wide: false,
}

