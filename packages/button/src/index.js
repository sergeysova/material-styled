import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'


import { shadows } from '@material-styled/shadow'


const ifProp = (name, styles) => props => props[name]
  ? styles
  : null


const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  transition: all .23s ease-in-out;
  cursor: pointer;
  user-select: none;
  color: black;

  border-radius: 2px;
  font-size: 14px;
  height: 36px;
  margin: 6px 8px;
  min-width: 64px;
  padding: 0 8px;

  background-color: rgba(0,0,0,.05);
  box-shadow: ${shadows[1]};

  &:hover {
    background-color: rgba(0,0,0,.07);
    box-shadow: ${shadows[2]};
  }
  &:active {
    box-shadow: ${shadows[4]};
  }
  &[disabled] {
    box-shadow: none;
    background-color: rgba(0,0,0,.05);
    opacity: 88%;
    color: rgba(0,0,0,.26);
  }

  ${ifProp('dense', css`
    font-size: 13px;
    height: 32px;
  `)}

  ${ifProp('flat', css`
    min-width: 88px;
    box-shadow: none;
    background-color: transparent;

    &:hover {
      background-color: rgba(0,0,0,.12);
      box-shadow: none;
    }
    &:active {
      background-color: rgba(0,0,0,.26);
      box-shadow: none;
    }

    &[disabled] {
      color: rgba(0,0,0,.26);
      box-shadow: none;
    }
  `)}
`

Button.propTypes = {
  dense: PropTypes.bool,
  disabled: PropTypes.bool,
}

Button.defaultProps = {
  dense: false,
  disabled: false,
}

export default Button
