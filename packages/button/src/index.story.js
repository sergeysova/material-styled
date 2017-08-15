import React from 'react'
import { storiesOf } from '@storybook/react'

import Button from './'


storiesOf('core/Button', module)
  .add('Without props', () => (
    <div style={{ padding: '30px', display: 'flex', flexFlow: 'row nowrap' }}>
      <Button>Press</Button>
    </div>
  ))
  .add('Disabled', () => (
    <div style={{ padding: '30px', display: 'flex', flexFlow: 'row nowrap' }}>
      <Button disabled>Flat</Button>
    </div>
  ))
  .add('Flat', () => (
    <div style={{ padding: '30px', display: 'flex', flexFlow: 'row nowrap' }}>
      <Button flat>Flat</Button>
    </div>
  ))
