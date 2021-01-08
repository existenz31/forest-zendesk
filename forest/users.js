const { collection } = require('forest-express-sequelize');

const UserUtil = require('../zendesk/services/user-util');

collection('users', {
  actions: [],
  fields: [
  {
    field: 'zendesk_requested_tickets',
    type: ['String'],
    reference: 'zendesk_tickets.id',
  },
  {
    field: 'zendesk_user',
    type: 'String',
    reference: 'zendesk_users.id',
    get: (record) => {
      if (!record.currentUser) return null;
      let userUtil = new UserUtil();
      let zendesk_user = userUtil.findByEmail(record.currentUser.email);
      delete record.currentUser;
      return zendesk_user;
    },
  },
  {
    field: 'dummy2',
    type: 'String',
  },
  ],
  segments: [],
});
