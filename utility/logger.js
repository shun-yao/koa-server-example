'use strict';

let moment = require('moment'),
  path = require('path'),

  // loads Scribe
  scribe = require('scribe-js')({
    createDefaultConsole : false
  });


let _logger = new scribe.LogWriter(path.join('/var', 'log', 'insurance'));
_logger.getPath = function (opt) {
  return path.join(moment().format('YYYYMMDD'));
};
_logger.getFilename = function (opt) {
  return "node-api.log";
};

let logger = scribe.console({
  console: {colors: 'inverse'}
}, _logger);

module.exports = {
  logRequest: function * (next) {
    // log request
    logger.log({
      type: 'request',
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      data: this.request.body
    });

    yield next;
  },

  logResponse: function * (next) {
    logger.log({
      type: 'response',
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      data: this.api.response
    });

    yield next;
  },

  log: function (type, url, data) {
    logger.log({
      type: type,
      url: url,
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      data: data
    });
  }
};