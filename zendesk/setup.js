"use strict";

var _ = require('lodash');

var _require = require('forest-express/dist/utils/integrations'),
    pushIntoApimap = _require.pushIntoApimap;

// const UserUtil = require('../zendesk/services/user-util');

const INTEGRATION_NAME = 'zendesk';

exports.createCollections = function (Implementation, apimap, collectionAndFieldName) {
  pushIntoApimap(apimap, {
    name: "zendesk_users",
    displayName: "Zendesk Users",
    icon: 'comments-o',
    idField: 'id',
    integration: INTEGRATION_NAME,
    isVirtual: true,
    isReadOnly: true,
    paginationType: 'page',
    fields: [{
      field: 'id',
      type: 'Number',
      isPrimaryKey: true,
      isVirtual: true,
      isFilterable: false
    }, {
      field: 'name',
      type: 'String',
      isVirtual: true,
      isFilterable: true
    }, {
      field: 'email',
      type: 'String',
      isVirtual: true,
      isFilterable: true
    }, {
      field: 'role',
      type: 'String',
      isVirtual: true,
      isFilterable: true
    }, {
      field: 'phone',
      type: 'String',
      isVirtual: true,
      isFilterable: false
    }, {
      field: 'last_login_at',
      type: 'Date',
      isVirtual: true,
      isFilterable: false
    }, {
      field: 'verified',
      type: 'Boolean',
      isVirtual: true,
      isVirtual: true,
    }, {
      field: 'active',
      type: 'Boolean',
      isVirtual: true,
      isFilterable: true
    }, {
      field: 'created_at',
      type: 'Date',
      isVirtual: true,
      isFilterable: false
    }, {
      field: 'updated_at',
      type: 'Date',
      isVirtual: true,
      isFilterable: false
    }, {
      field: 'direct_url',
      type: 'String',
      isVirtual: true,
      isFilterable: false,
    }, {
      field: 'zendesk_requested_tickets',
      type: ['String'],
      reference: 'zendesk_tickets.id',
      isVirtual: true,
      isFilterable: true,
    }, ]
  });

  pushIntoApimap(apimap, {
    name: "zendesk_tickets",
    displayName: "Zendesk Tickets",
    icon: 'comments-o',
    idField: 'id',
    integration: INTEGRATION_NAME,
    isVirtual: true,
    isReadOnly: true,
    paginationType: 'page',
    fields: [{
      field: 'id',
      type: 'Number',
      isFilterable: false,
      isVirtual: true,
    }, {
      field: 'created_at',
      type: 'Date',
      isFilterable: false,
      isVirtual: true,
    }, {
      field: 'updated_at',
      type: 'Date',
      isFilterable: false,
      isVirtual: true,
    }, {
      field: 'type',
      type: 'String',
      isFilterable: true,
      isVirtual: true,
    }, {
      field: 'status',
      type: 'String',
      isFilterable: false,
      isVirtual: true,
    }, {
      field: 'subject',
      type: 'String',
      isFilterable: false,
      isVirtual: true,
    }, {
      field: 'description',
      type: 'String',
      isFilterable: false,
      isVirtual: true,
    }, {
      field: 'comment_count',
      type: 'Number',
      isFilterable: false,
      isVirtual: true,
    }, {
      field: 'requester',
      type: 'String',
      reference: 'zendesk_users.id',
      isFilterable: true,
      isVirtual: true,
    }, {
      field: 'submitter',
      type: 'String',
      reference: 'zendesk_users.id',
      isFilterable: true,
      isVirtual: true,
    }, {
      field: 'assignee',
      type: 'String',
      reference: 'zendesk_users.id',
      isFilterable: true,
      isVirtual: true,
    }, {
      field: 'direct_url',
      type: 'String',
      isFilterable: false,
      isVirtual: true,
    }
  ],
    actions: []
  });

};

exports.createFields = function (Implementation, model, schemaFields) {
  // schemaFields.push({
  //   field: 'zendesk_requested_tickets',
  //   //displayName: 'Tickets',
  //   type: ['String'],
  //   reference: 'zendesk_tickets.id',
  //   // column: null,
  //   isFilterable: false,
  //   isReadOnly: false,
  //   isVirtual: true,
  //   isSortable: true,
  //   // relationship: 'HasMany',
  //   // integration: INTEGRATION_NAME,
  // });
  // schemaFields.push({
  //   field: 'zendesk_user',
  //   //displayName: 'ZE User',
  //   type: 'String',
  //   reference: 'zendesk_users.id',
  //   // column: null,
  //   isFilterable: false,
  //   isReadOnly: false,
  //   isVirtual: true,
  //   isSortable: true,
  //   // integration: INTEGRATION_NAME,
  //   get: (record) => {
  //     // let userGetter = new UserGetter();
  //     // return userGetter.findByEmail(user.email);
  //     let userUtil = new UserUtil();
  //     if (!record.currentUser) return null;
  //     let zendesk_user = userUtil.findByEmail(record.currentUser.email);
  //     delete record.currentUser;
  //     return zendesk_user;
  //   },
  // });  
};
