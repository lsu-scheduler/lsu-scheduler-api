/**
 * Controls fetching information from the open lsu booklet portal
 *
 * @module fetch
 * @class routes
 */
module.exports = {
  /**
   * Generates API routes for all of the ./models that are allowed in config var
   *
   * @method generateApiRoutes
   * @param {Json} sequelizeJsonApiConfig
   * @return void
   */
   sequelizeJsonApiRoutes = function(sequelizeJsonApiConfig){
    if(typeof(sequelizeJsonApiConfig) === 'undefined')
      sequelizeJsonApiConfig = {};
    // Configure the api
    var apiRoutes = api = require('sequelize-json-api'); // api mod
    apiRoutes = api(db.sequelize, sequelizeJsonApiConfig);
    //Generate routes for models in config
    apiRoutes.initialize();
    return apiRoutes;
  },
  /**
   * Tell express how to serve routes for /, /docs, and serve a restful api interface
   * of all the models configured in ./models
   *
   * @method setupRouting
   * @param {Object} express
   * @return void
   */
  setupRouting = function(expressApp, apiRoutes){
      // Configure express
      expressApp.use('/', express.static(__dirname + '/dist'));
      // Use api routes
      expressApp.use('/api', apiRoutes);
      expressApp.use('/docs', express.static(__dirname + '/public/docs'));
      // don't throw a 404, just send index.html.  ususally a good idea.
      expressApp.get('*', function(request, response){
        response.sendFile(__dirname + '/dist/index.html');
      });
      return expressApp;
  }
};
