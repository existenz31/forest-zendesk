"use strict";
/* eslint-disable no-undef */

class AbstractGetter {
  constructor(Implementation, params, user, opts, integrationInfo) {
    this.Implementation = Implementation;
    this.integrationInfo = integrationInfo;
    this.params = params;
    this.opts = opts;

    this.apiKey = opts.apiKey;
    this.user = user;
  } 

  getToken () {
    const authEmail = this.opts.authMethod === 'serviceAccount'? this.opts.serviceAccount : this.user.email;
    return Buffer.from(`${authEmail}/token:${this.apiKey}`).toString('base64');
  }

  perform () {
    throw new Error('You have to implement the method perform!');
  }
}

module.exports = AbstractGetter;
