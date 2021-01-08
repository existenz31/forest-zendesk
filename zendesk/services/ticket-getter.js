"use strict";

const axios = require('axios');
const AbstractGetter = require('./abstract-getter');

class TicketGetter extends AbstractGetter {

  perform () {
    return axios.get(`https://forestadmin-sehelp.zendesk.com/api/v2/tickets/${this.params.ticketId}?include=comment_count`, {
      headers: {
        'Authorization': `Basic ${this.getToken()}` 
      },
    })
    .then( (response) => {
      //console.log(response);
      return response.data.ticket;
    });
  };
}

module.exports = TicketGetter;
