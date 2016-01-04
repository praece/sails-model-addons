var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var _          = require('lodash');

module.exports = function (sails) {
  var loader     = require('sails-util-mvcsloader')(sails);

  // Load config from default directories
  loader.configure({
    config: __dirname + '/config' // Path to the config to load
  });

  return {
    routes: {
      before: {
        'GET /*': function (req, res, next) {
          var prefix = sails.config.blueprints.prefix;
          var path = req.path;
          var pathParts = _.startsWith(path, prefix) ? path.replace(prefix, '').split('/') : path.split('/');
          var identity = pathParts[1];
          var Model = sails.models[identity];

          // If we are running a get for a model, add any default filters.
          if (Model) {
            req.options.where = _.defaults(req.options.where || {}, Model.defaultWhere);
          }

          return next();
        }
      }
    },
    configure: function () {
      sails.config.paths.blueprints = __dirname + '/blueprints';
    }
  };
};