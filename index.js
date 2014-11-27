//========================================================================================
/*
/* FILE NAME: Index.js
/*
/* DESCRIPTION: Server script that controls the LSU Scheduler backend, including
/* the API used to communicate with front-end clients, managing data requests,
/* and fetching updated information from LSU's system.
/*
/* AUTHORS: Chester Schofield, Selby Kendrick
/*
/* REFERENCE:
/*
/* DATE BY CHANGE DESCRIPTION
/* ======== ======= =========== =============
/* 11/16/2014 Chester Schofield  Created get and post for courses
/* 11/17/2014 Selby Kendrick     Removed example get for showing how to fetch
/*                               course info, implemented it for departments,
/*                               added more detailed comments, and cleaned up the
/*                               code some.
/*
//========================================================================================

/**
 * Server script that controls the LSU Scheduler backend, including
 * the API used to communicate with front-end clients, managing data requests,
 * and fetching updated information from LSU's system.
 *
 * @module lsu-scheduler
 * @main lsu-scheduler
 * @class LSU Scheduler API
 */

// New relic does our performance and avaliability testing/analytics
// This should be the first statement in index.
require('newrelic');

// Import the npm modules we need to use
var express = require('express'), // Express is the server provider
  http = require('http'), // node's http system
  db = require('./models'); // Sequelize!

var config = {
  sequelizeJsonApi: {
    endpoint: '/api', // needed for href calculation
  }
};

/**
 * Configure Express server to use Heroku port or 5000, use gzip compression, automatgickly
 * parse json requests to get  js object, and accept url-encodingsds
 *
 * @method setupExpress
 * @param {Object} express
 * @return void
 */
var setupExpress = function(expressApp){
  var compress = require('compression'), // this compresses stuff
      bodyParser = require('body-parser'), // So we can parse the various formats we will recieve
      cors = require('cors');
  // Configure express
  expressApp.set('port', (process.env.PORT || 5000)); // Port to use, process.env.PORT is set by heroku
  expressApp.use(compress()); // Tells Express to use gzip encryption
  expressApp.use( bodyParser.json() ); // JSON-encoded body support
  expressApp.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));
  expressApp.use( cors() ); // cors enables cross site scripting
  return expressApp;
}


/**
 * Runs lsu-scheduler by setting up express, building api routes, and seting up
 * the database to start serving LSU Scheduler and all it's goodness
 *
 * @method run
 * @return void
 */
var run = function(){
  var server = express();

  server = setupExpress(server);

  var apiRoutes = generateApiRoutes(config.sequelizeJsonApi);
  server = setupRouting(server, apiRoutes);

  // Sync the database and start start listening so we can respond to requests
  db.sequelize.sync().complete(function(err) {
    if (err) {
      throw err[0];
    } else {
      http.createServer(server).listen(server.get('port'), function(){
        console.log('Express server listening on port ' + server.get('port'));
      });
    }
  });
};

// run lsu-scheduler
run();

var fetch = require('fetch');

// Start fetching data
fetch.fetchData(5, 3, 72);
