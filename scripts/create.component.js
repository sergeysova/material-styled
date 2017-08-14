const { resolve } = require('path')
const pify = require('pify')
const { readFile } = pify(require('fs'))
const Inquirer = require('inquirer')
const chalk = require('chalk')
const changeCase = require('change-case')
const progress = require('progress')
const glob = pify(require('glob'))
const mkdirp = pify(require('mkdirp'))


/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */

const REJECTED_PACKAGES = ['core']
const AVAILABLE_BUNDLES = [{ name: 'core', checked: true }]
const BASE_PACKAGE = 'Paper'


async function readPackages() {
  const packages = await glob('packages/*/package.json', { cwd: resolve(__dirname, '..') })

  return (await Promise.all(packages.map(file => readFile(file, 'utf8'))))
    .map(JSON.parse)
    .filter((pkg) => {
      const [, name] = pkg.name.split('/')
      if (name && !REJECTED_PACKAGES.includes(name)) {
        return true
      }

      return false
    })
}

function packagesAsList(list) {
  return list
    .map(pkg => pkg.name.split('/')[1])
    .map(changeCase.pascalCase)
}


async function createQuestions() {
  return [
    {
      name: 'componentName',
      type: 'input',
      message: 'Name of a new component:',
      filter: changeCase.pascalCase,
    },
    {
      name: 'baseComponentName',
      type: 'list',
      message: 'Select base component name:',
      default: BASE_PACKAGE,
      choices: packagesAsList(await readPackages()),
    },
    {
      name: 'appendTo',
      type: 'checkbox',
      message: 'Add package to:',
      choices: AVAILABLE_BUNDLES,
    },
  ]
}


const processEach = (prev, curr) => (content) => {

}


async function findComponentFiles(baseName) {
  const baseNamePath = changeCase.paramCase(baseName)

  const list = await glob(`packages/${baseNamePath}/**/*`, { ignore: ['**/node_modules/**', '**/dist/**'] })
  return list
}


async function copyComponentFiles(baseName, targetName, list) {
  const baseNamePath = changeCase.paramCase(baseName)
  const targetNamePath = changeCase.paramCase(targetName)

  const contents = await Promise.all(list.map(file => readFile(file, 'utf8')))
}


async function askForCreation(baseName, targetName, list) {
  const baseNamePath = changeCase.paramCase(baseName)
  const targetNamePath = changeCase.paramCase(targetName)

  console.log('Files:', { baseNamePath, targetNamePath })

  list.forEach((file) => {
    console.log('- ', chalk.green(file.replace(baseNamePath, targetNamePath)))
  })

  const result = await Inquirer.prompt([
    {
      name: 'create',
      type: 'confirm',
      message: `Create component "${targetName}"? `,
    },
  ])

  return result.create
}


async function main() {
  const options = await Inquirer.prompt(await createQuestions())
  const foundList = await findComponentFiles(options.baseComponentName)

  if (await askForCreation(options.baseComponentName, options.componentName, foundList)) {
    await copyComponentFiles(options.baseComponentName, options.componentName, foundList)
  }
  else {
    console.log(chalk.gray('Cancelled'))
  }
}


main()
