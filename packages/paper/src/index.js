import styled from 'styled-components'
import PropTypes from 'prop-types'


const shadows = {
  1: '0 0 2px 0 rgba(0,0,0,0.14), 0 2px 2px 0 rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.20)',
  2: '0 2px 4px 0 rgba(0,0,0,0.14), 0 3px 4px 0 rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.20)',
}

const Paper = styled.div`
  display: inline-block;
  background-color: white;
  box-shadow: ${p => shadows[p.z]};
  color: inherit;
`

Paper.propTypes = {
  z: PropTypes.oneOf(Object.keys(shadows)),
  color: PropTypes.string,
}

Paper.defaultProps = {
  z: 1,
  color: 'white',
}

export default Paper
