"use strict";

var _ = require('lodash');
var Schemas = require('forest-express/dist/generators/schemas');

var logger = require('forest-express/dist/services/logger');

var Routes = require('./routes');

var Setup = require('./setup');

function Checker(opts, Implementation, app) {
  var integrationValid = false;
  this.apiKey = opts.apiKey;

  function hasIntegration() {
    return opts.apiKey;
  }


  function isProperlyIntegrated() {
    return opts.apiKey && opts.mapping;
  }

  function isMappingValid() {
    return true;
  }

  function castToArray(value) {
    return _.isString(value) ? [value] : value;
  }

  function integrationCollectionMatch(integration, model) {
    return true;
  }

  if (hasIntegration()) {
    if (isProperlyIntegrated()) {
      opts.mapping = castToArray(opts.mapping);
      integrationValid = isMappingValid();
    } else {
      logger.error('Cannot setup properly your Zendesk integration.');
    }
  }

  this.defineRoutes = function (app, model) {
    if (!integrationValid) {
      return;
    }

    if (integrationCollectionMatch(opts, model)) {
      new Routes(app, model, Implementation, opts).perform();
    }
  };

  this.defineCollections = function (collections) {
    if (!integrationValid) {
      return;
    }

    _.each(opts.mapping, function (collectionAndFieldName) {
      Setup.createCollections(Implementation, collections, collectionAndFieldName);
    });
  };

  this.defineFields = function (model, schema) {
    if (!integrationValid) {
      return;
    }

    if (integrationCollectionMatch(opts, model)) {
      Setup.createFields(Implementation, model, schema.fields);
    }
  };

  this.defineSerializationOption = function (model, schema, dest, field) {
    if (integrationValid && field.integration === 'zendesk') {
      dest[field.field] = {
        ref: 'id',
        attributes: [],
        included: false,
        nullIfMissing: true,
        // TODO: This option in the JSONAPISerializer is weird.
        ignoreRelationshipData: true,
        relationshipLinks: {
          related: function related(dataSet) {
            return {
              href: "/forest/".concat(Implementation.getModelName(model), "/").concat(dataSet[schema.idField], "/").concat(field.field)
            };
          }
        }
      };
    }
  };


  var collections = _.values(Schemas.schemas);
  this.defineCollections(collections);
  Schemas.schemas = _.mapValues(_.keyBy(collections, 'name'));


//  let usersSchema = Schemas.schemas['users'];
//  let usersModel = Implementation.getModels()['users'];

//   this.defineFields(usersModel, usersSchema);
//  Schemas.schemas['users'] = usersSchema;  
// this.defineRoutes(app, usersModel);

}

module.exports = Checker;