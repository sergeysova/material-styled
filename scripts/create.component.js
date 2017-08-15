const { resolve, dirname } = require('path')
const pify = require('pify')
const { readFile, writeFile } = pify(require('fs'))
const debug = require('debug')('mst')
const Inquirer = require('inquirer')
const ProgressBar = require('progress')
const chalk = require('chalk')
const changeCase = require('change-case')
const semver = require('semver')
const glob = pify(require('glob'))
const mkdirp = pify(require('mkdirp'))


/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */

const REJECTED_PACKAGES = ['core', 'theming']
const AVAILABLE_BUNDLES = [{ name: 'core', checked: true }]
const BASE_PACKAGE = 'Paper'
const INITIAL_VERSION = '0.0.1'
const LIBRARY_NAME = require('../package.json').name


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

  const versionValidator = (value) => {
    if (!semver.valid(value)) {
      return 'Please, enter valid semver version'
    }

    if (semver.major(value) !== 0) {
      return 'New component should be 0.Y.Z version'
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
      name: 'version',
      type: 'input',
      message: 'Initial version of a new component:',
      default: INITIAL_VERSION,
      validate: versionValidator,
    },
    {
      name: 'baseComponentName',
      type: 'list',
      message: 'Select base component name:',
      default: BASE_PACKAGE,
      choices: listOfPackages,
    },
    {
      name: 'appendToScopes',
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
      .replace(new RegExp(pkg.version, 'g'), INITIAL_VERSION)

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


async function addToScopes(targetName, scopes) {
  const pathName = changeCase.paramCase(targetName)

  if (scopes.length) {
    for (const scope of scopes) {
      try {
        const packagePath = resolve(__dirname, '..', 'packages', scope, 'package.json')
        const readmePath = resolve(__dirname, '..', 'packages', scope, 'readme.md')
        const indexPath = resolve(__dirname, '..', 'packages', scope, 'src', 'index.js')

        const pkg = JSON.parse(await readFile(packagePath, 'utf8'))
        let readme = await readFile(readmePath, 'utf8')
        let index = await readFile(indexPath, 'utf8')

        pkg.dependencies[`@${LIBRARY_NAME}/${pathName}`] = `^${INITIAL_VERSION}`
        readme += `- ${targetName}\n`
        index += `export ${targetName} from '@${LIBRARY_NAME}/${pathName}'\n`

        await writeFile(packagePath, JSON.stringify(pkg, 2, 2), { encoding: 'utf8' })
        await writeFile(readmePath, readme, { encoding: 'utf8' })
        await writeFile(indexPath, index, { encoding: 'utf8' })

        console.log(`Component ${chalk.bold.white(targetName)} added to scope ${chalk.bold(scope)}`)
      }
      catch (error) {
        debug(`add ${targetName} to scope ${scope}`, error, error.stack)
        console.log('!', chalk.yellow(`${targetName} not added to scope ${scope}`))
      }
    }
  }
}


async function main() {
  const options = await Inquirer.prompt(await createQuestions())
  const foundList = await findComponentFiles(options.baseComponentName)

  if (await askForCreation(options.baseComponentName, options.componentName, foundList)) {
    await processComponentFiles(options.baseComponentName, options.componentName, foundList)
    await addToScopes(options.componentName, options.appendToScopes)
    console.log('\n', chalk.white.bold('Complete!'), '\n')
    console.log('Now run', chalk.green('npm run bs'), 'to install dependencies')
    console.log('Then run', chalk.green('npm run build'), 'to build all components\n')
  }
  else {
    console.log(chalk.gray('Cancelled'))
  }
}


main().catch((error) => {
  console.log(chalk.red(error.message))
  console.log(chalk.yellow(error.stack))
})
