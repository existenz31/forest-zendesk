const chalk = require('chalk');
const path = require('path');
const Liana = require('forest-express-sequelize');
const { sequelize } = require('../models');
const models = require('../models');
const zendesk = require('../zendesk');
const { generateAndSendSchema } = require('forest-express/dist');

var Schemas = require('forest-express/dist/generators/schemas');
var _ = require('lodash');

var ConfigStore = require('forest-express/dist/services/config-store');

module.exports = async function forestadmin(app) {

  // var configStore = ConfigStore.getInstance();
  // var collections = _.values(Schemas.schemas);
  // var client = new zendesk({mapping: 'users.email', apiKey: process.env.ZENDESK_API_TOKEN}, null);
  // client.defineCollections(collections);
  // Schemas.schemas = collections;

  app.use(await Liana.init({
    modelsDir: path.join(__dirname, '../models'),
    configDir: path.join(__dirname, '../forest'),
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    sequelize,
  }));

  var configStore = ConfigStore.getInstance();
  var client = new zendesk({mapping: 'users.email', apiKey: process.env.ZENDESK_API_TOKEN}, configStore.Implementation, app);
  configStore.zendesk = client;
  
  generateAndSendSchema({envSecret: process.env.FOREST_ENV_SECRET});

  // client.defineCollections();
  // client.defineSegments();
  // client.defineFields();
  console.log(chalk.cyan('Your admin panel is available here: https://app.forestadmin.com/projects'));
};
