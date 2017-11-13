const context = require('../cli-context');
const createApp = require('../create-app');
const yarn = require('../yarn');


function newCommand(argv) {
  if (argv.item !== 'app') {
    console.log('Only "app" modules are currently supported');
    return;
  }

  // TODO: Verify destination folder
  let appDir = '';
  if (context.type !== 'empty') {
    console.log('Existing package.json found. Nothing created.');
    return;
  }

  console.log('Creating app...');
  createApp(argv.name).then((appData) => {
    if (argv.install) {
      appDir = appData.appDir;
      console.log('Installing dependencies...');
      return yarn.install(appDir);
    } else {
      return { isInstalled: false };
    }
  }).then((result) => {
    console.log('All done!');
    if (result.isInstalled) {
      console.log(`"cd ${appDir}" and then "str serve" to run your new app`);
    } else {
      console.log(`"cd ${appDir}", "yarn install", and then "str serve" to run your new app`);
    }
  });
}

module.exports = {
  command: 'new <item> <name>',
  describe: 'Create a new Stripes module',
  builder: (yargs) => {
    yargs
      .positional('item', {
        describe: 'Item to create',
        type: 'string',
        choices: ['app', 'plugin', 'platform', 'test'],
      })
      .positional('name', {
        describe: 'Name of item',
        type: 'string',
      })
      .option('install', {
        describe: 'Yarn install dependencies',
        type: 'boolean',
      })
      .example('$0 new app "Hello World"', 'Create new Stripes UI app and directory')
      .example('$0 new app "Hello World" --install', 'Create new Stripes UI app, directory, and install dependencies');
    return yargs;
  },
  handler: newCommand,
};