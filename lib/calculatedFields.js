/**
 * Module dependencies
 */
var _         = require('lodash');
var Promise   = require('bluebird');

/**
 * Calculated Fields Service
 *
 * Used to add populated values from populated fields.
 */
module.exports = {
	populate: function(records, Model, single) {
    if (!_.isArray(records)) return this.populate([records], Model, true).get(0);

    var settings = Model.description.settings.calculatedFields;
    var promises = [];

    _.forEach(settings, function(method) {
      promises.push(Model[method](records, single));
    });

    return Promise.all(promises).return(records);
	}
};