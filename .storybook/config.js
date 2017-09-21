import { configure } from '@storybook/react'

function loadStories() {
  const req = require.context('../packages/', true, /src\/\w+\.story\.js$/)

  req.keys().forEach(req)
}

configure(loadStories, module)
