'use strict';

module.exports = {
  verify: function * (next) {
    let queryString = this.path.split('/'),
      action = queryString[queryString.length - 1];

    // init app variable
    if (!this.api)
      this.api = {};

    this.api.action = action;

    yield next;
  }
};