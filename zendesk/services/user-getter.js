"use strict";
/* eslint-disable no-undef */

const axios = require('axios');
const AbstractGetter = require('./abstract-getter');
const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

class UserGetter extends AbstractGetter {

  perform () {
    return axios.get(`${ZENDESK_URL_PREFIX}/api/v2/users/${this.params.userId}.json`, {
      headers: {
        'Authorization': `Basic ${this.getToken()}` 
      },
    
    })
    .then( (response) => {
      //console.log(response);
      return response.data.user;
    });
  }
}

module.exports = UserGetter;
