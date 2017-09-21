import React from 'react'
import { storiesOf } from '@storybook/react'

import Paper from './'


storiesOf('core/Paper', module)
  .add('Without props', () => (
    <div style={{ padding: '30px' }}>
      <Paper>Default z=1</Paper>
    </div>
  ))
  .add('With z=3', () => (
    <div style={{ padding: '30px' }}>
      <Paper z="3">Z level 3</Paper>
    </div>
  ))
  .add('With z=6', () => (
    <div style={{ padding: '30px' }}>
      <Paper z="6">Z level 6</Paper>
    </div>
  ))
  .add('With z=12', () => (
    <div style={{ padding: '30px' }}>
      <Paper z="12">Z level 12</Paper>
    </div>
  ))
  .add('With z=16', () => (
    <div style={{ padding: '30px' }}>
      <Paper z="16">Z level 16</Paper>
    </div>
  ))
  .add('With z=24', () => (
    <div style={{ padding: '30px' }}>
      <Paper z="24">Z level 24</Paper>
    </div>
  ))
