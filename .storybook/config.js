import React from 'react'
import styled from 'styled-components'
import { configure, addDecorator } from '@storybook/react'

function loadStories() {
  const req = require.context('../packages/', true, /src\/\w+\.story\.js$/)

  req.keys().forEach(req)
}

const RootDecorator = styled.div`
  display: flex;
  flex-flow: row nowrap;
  padding: 30px;
`

addDecorator(fn => <RootDecorator>{fn()}</RootDecorator>)

configure(loadStories, module)
