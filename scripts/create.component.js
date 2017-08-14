const { resolve, dirname } = require('path')
const pify = require('pify')
const { readFile, writeFile } = pify(require('fs'))
const debug = require('debug')('mst')
const Inquirer = require('inquirer')
const ProgressBar = require('progress')
const chalk = require('chalk')
const changeCase = require('change-case')
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
  const packages = await readPackages()
  const listOfPackages = packagesAsList(packages)

  const componentNameValidator = (value) => {
    if (value.trim().length === 0) {
      return 'Please, name a component'
    }

    if (listOfPackages.map(e => e.toLowerCase()).includes(value.toLowerCase())) {
      return 'Component with that name already exists'
    }

    if (REJECTED_PACKAGES.map(e => e.toLowerCase()).includes(value.toLowerCase())) {
      return 'Please, select another name for a component'
    }

    return true
  }

  return [
    {
      name: 'componentName',
      type: 'input',
      message: 'Name of a new component:',
      filter: changeCase.pascalCase,
      validate: componentNameValidator,
    },
    {
      name: 'baseComponentName',
      type: 'list',
      message: 'Select base component name:',
      default: BASE_PACKAGE,
      choices: listOfPackages,
    },
    {
      name: 'appendTo',
      type: 'checkbox',
      message: 'Add package to:',
      choices: AVAILABLE_BUNDLES,
    },
  ]
}


async function findComponentFiles(baseName) {
  const baseNamePath = changeCase.paramCase(baseName)

  const list = await glob(`packages/${baseNamePath}/**/*`, { ignore: ['**/node_modules/**', '**/dist/**'], nodir: true })
  return list
}


async function processComponentFiles(baseName, targetName, list) {
  const baseNamePath = changeCase.paramCase(baseName)
  const targetNamePath = changeCase.paramCase(targetName)

  const pkg = JSON.parse(await readFile(resolve(__dirname, '..', 'packages', baseNamePath, 'package.json')))

  const bar = new ProgressBar('Complete: :bar :current/:total', { total: list.length, complete: '◾', incomplete: '◽' })

  for (let i = 0; i < list.length; i++) {
    const basePath = resolve(__dirname, '..', list[i])
    const targetPath = resolve(__dirname, '..', list[i].replace(baseNamePath, targetNamePath))
    debug('Process file', basePath, '=>', targetPath)

    const baseSource = await readFile(basePath, 'utf8')

    const newSource = baseSource.toString()
      .replace(pkg.description, `{Description for ${targetName}}`)
      .replace(new RegExp(baseNamePath, 'g'), targetNamePath)
      .replace(new RegExp(baseName, 'g'), targetName)
      .replace(new RegExp(pkg.version, 'g'), '0.0.1')

    await mkdirp(dirname(targetPath))
    await writeFile(targetPath, newSource, { encoding: 'utf8' })

    bar.tick()
  }
}


async function askForCreation(baseName, targetName, list) {
  const baseNamePath = changeCase.paramCase(baseName)
  const targetNamePath = changeCase.paramCase(targetName)

  debug('Base name path:', baseNamePath, ':', baseName)
  debug('Target name path:', targetNamePath, ':', targetName)
  console.log('Files:')

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
    await processComponentFiles(options.baseComponentName, options.componentName, foundList)
  }
  else {
    console.log(chalk.gray('Cancelled'))
  }
}


main().catch((error) => {
  console.log(chalk.red(error.message))
  console.log(chalk.yellow(error.stack))
})
