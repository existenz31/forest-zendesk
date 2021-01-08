"use strict";

var _ = require('lodash');

var IntegrationInformationsGetter = require('forest-express/dist/services/integration-informations-getter');

var TicketsGetter = require('./services/tickets-getter');
var TicketGetter = require('./services/ticket-getter');
var UsersGetter = require('./services/users-getter');
var UserGetter = require('./services/user-getter');

var serializeTickets = require('./serializers/tickets');
var serializeUsers = require('./serializers/users');

var auth = require('forest-express/dist/services/auth');
var path = require('forest-express/dist/services/path');

var ConfigStore = require('forest-express/dist/services/config-store');
var configStore = ConfigStore.getInstance();

module.exports = function Routes(app, model, opts) {
  var Implementation = configStore.Implementation;
  var modelName = Implementation.getModelName(model);
  var integrationInfo;

  if (opts) {
    integrationInfo = new IntegrationInformationsGetter(modelName, Implementation, opts).perform();
  }

  if (integrationInfo) {
    var SEPARATOR = '.';
    var integrationValues = integrationInfo.split(SEPARATOR);
    integrationInfo = {
      collection: Implementation.getModels()[integrationValues[0]],
      field: integrationValues[1],
      embeddedPath: integrationValues.slice(2).join(SEPARATOR) || null
    };
  }

  var getTickets = function getTickets(request, response, next) {
    new TicketsGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform().then(function (results) {
      var count = results[0];
      var tickets = results[1];
      return serializeTickets(tickets, modelName, {
        count: count
      });
    }).then(function (tickets) {
      response.send(tickets);
    })["catch"](next);
  };

  var getTicket = function getTicket(request, response, next) {
    new TicketGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform().then(function (ticket) {
      return serializeTickets(ticket, modelName);
    }).then(function (ticket) {
      response.send(ticket);
    })["catch"](next);
  };

  var getUsers = function getUsers(request, response, next) {
    new UsersGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform().then(function (results) {
      var count = results[0];
      var users = results[1];
      return serializeUsers(users, modelName, {
        count: count
      });
    }).then(function (users) {
      response.send(users);
    })["catch"](next);
  };

  var getUser = function getUser(request, response, next) {
    new UserGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform().then(function (user) {
      return serializeUsers(user, modelName);
    }).then(function (user) {
      response.send(user);
    })["catch"](next);
  };

  this.perform = function () {
    if (integrationInfo) {

      app.get(path.generate("zendesk_tickets", opts), auth.ensureAuthenticated, getTickets);
      //app.get(path.generate("/:recordId/zendesk_tickets", opts), auth.ensureAuthenticated, getTickets);
      app.get(path.generate("zendesk_tickets/:ticketId", opts), auth.ensureAuthenticated, getTicket);
  
      app.get(path.generate("".concat(modelName,"/:recordId/relationships/zendesk_requested_tickets"), opts), auth.ensureAuthenticated, getTickets);

      app.get(path.generate("zendesk_users", opts), auth.ensureAuthenticated, getUsers);
      app.get(path.generate("/:recordId/zendesk_users", opts), auth.ensureAuthenticated, getUsers);
      app.get(path.generate("zendesk_users/:userId", opts), auth.ensureAuthenticated, getUser);    }
  };
};