"use strict";

const axios = require('axios');
const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

var ConfigStore = require('forest-express/dist/services/config-store');
var configStore = ConfigStore.getInstance();

class UserUtil {
  constructor() {
    this.apiKey = configStore.zendesk.apiKey;
  } 

  getToken (email) {
    return Buffer.from(`${email}/token:${this.apiKey}`).toString('base64');
  };

  async findByEmail(email) {
    if (!email) return null;
    return axios.get(`${ZENDESK_URL_PREFIX}/api/v2/search.json`, {
      headers: {
        'Authorization': `Basic ${this.getToken(email)}` 
      },
      params: {
        query: `type:user user:${email}`,
      }
    }).then(response => {
      console.log(response);
      return response.data.results[0];    
    })
    // .catch(error => {
    //   console.log(error)
    // });
  }
}

module.exports = UserUtil;
