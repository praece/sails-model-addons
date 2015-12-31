module.exports = function (sails) {
  var loader = require('sails-util-mvcsloader')(sails);

  // Load config from default directories
  loader.configure({
    config: __dirname + '/config' // Path to the config to load
  });

  return {};
};