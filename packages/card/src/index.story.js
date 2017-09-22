import React from 'react'
import { storiesOf } from '@storybook/react'

import Button from '@material-styled/button'

import { Card, CardHeader, CardText, CardActions, CardMediaImage } from './'


storiesOf('core/Card', module)
  .add('Example card', () => (
    <Card>
      <CardHeader>
        <h1>Title goes here</h1>
        <h2>Subtitle here</h2>
      </CardHeader>
      <CardText>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
        nisi ut aliquip ex ea commodo consequat.
      </CardText>
      <CardActions>
        <Button flat>Action 1</Button>
        <Button flat>Action 2</Button>
      </CardActions>
    </Card>
  ))
  .add('With image media', () => (
    <Card wide maxWidth={20}>
      <CardHeader>
        <h1>Title goes here</h1>
        <h2>Subtitle here</h2>
      </CardHeader>
      <CardMediaImage
        height={6}
        image="https://material-components-web.appspot.com/images/16-9.jpg"
      />
      <CardActions>
        <Button flat>Action 1</Button>
        <Button flat>Action 2</Button>
      </CardActions>
    </Card>
  ))
  .add('Header and action', () => (
    <Card maxWidth={20}>
      <CardHeader>
        <h1>Title goes here</h1>
        <h2>Subtitle here</h2>
      </CardHeader>
      <CardActions>
        <Button flat>Action</Button>
      </CardActions>
    </Card>
  ))
  .add('Wide card', () => (
    <Card wide>
      <CardHeader>
        <h1>Title goes here</h1>
        <h2>Subtitle here</h2>
      </CardHeader>
      <CardActions>
        <Button flat>Action</Button>
      </CardActions>
    </Card>
  ))
