/**
 * Module dependencies
 */
var _         = require('lodash');
var Promise   = require('bluebird');

/**
 * Nested delete service
 *
 * Delete nested references.
 */
module.exports = {
	process: function(records, Model) {
    var settings = Model.description.settings.nestedDelete;
    var promises = [];
    var ids = _.pluck(records, 'id');

    _.forEach(Model.associations, function(association) {
      if (association.type === 'collection' && _.includes(settings, association.alias)) {
        var relatedModel = sails.models[association.collection];
        var params = {};
        params[association.via] = ids;

        promises.push(relatedModel.count(params)
          .then(function(count) { 
            if (!count) return true;

            return relatedModel.destroy(params);
          }));
      }
    });

    return Promise.all(promises);
	}
};