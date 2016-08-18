'use strict';

//require module 'koa' and else
var koa = require('koa'),
  bodyParser = require('koa-bodyparser'),
  Router = require('koa-router'),
  app = koa(),

  path = require('path'),
  fs = require('fs'),

  // user node_lib
  logger = require('./utility/logger'),
  security = require('./utility/security'),
  routes = require('./config/routes'),
  router;

app.use(bodyParser());

// handle error
app.use(function *(next) {
  try {
    yield next;
  } catch (err) {
    this.status = err.status || 500;
    let response = {
      success: false,
      error_code: err.code,
      error_msg: err.message
    };

    // force handled response to server status 200
    if (err.code)
      this.status = 200;

    // record error response
    logger.log('error', this.url, response);

    // return errors
    this.body = response;

    if (process.env.NODE_ENV != 'production')
      this.app.emit('error', err, this);
  }
});


// logger
app.use(function *logger(next){
  //log request
  logger.logRequest;

  yield next;

   // log response
  logger.logResponse;
});



// load all controllers
let controllerFileNames = fs.readdirSync('controllers'),
  jsTester = new RegExp(".js$"),
  controllers = {};

for (var i = controllerFileNames.length - 1; i >= 0; i--) {
  if (!jsTester.test(controllerFileNames[i]))
    continue;

  let controllerName = controllerFileNames[i].replace('.js', '');
  controllers[controllerName] = require('./controllers/'+controllerName);
}

// apply router controller
for (let controller in routes) {
  router = new Router({
    prefix: routes[controller]['prefix']
  });

  for (let action in routes[controller]['actions']) {
    // cannot find the right controller
    if (!controllers[controller][action])
      continue;

    // only post allow
    router.post(
      // route
      routes[controller]['actions'][action],

      // check certificate
      security.verify,

      // main function
      controllers[controller][action],

      // render response
      function * (next) {
        this.body = this.api.response;
      }
    );
  }
  app.use(router.routes());
  app.use(router.allowedMethods());
}

app.listen(3000);

