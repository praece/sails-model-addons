/**
 * Module dependencies
 */
var _         = require('lodash');
var Promise   = require('bluebird');

/**
 * BackReferenceService
 *
 * Used to return 1-to-1 back-references.
 */
module.exports = {
	populate: function(records, Model) {
		if (!_.isArray(records)) return this.populate([records], Model).get(0);

    var settings = Model.backReference;
		var ids = _.pluck(records, 'id');
    var promises = [];

    _.forEach(settings, function(config, key) {
    	var refModel = sails.models[config.model];
    	var params = {};
    	params[config.via] = ids;

    	promises.push(refModel.find(params)
    		.then(function(relations){
    			_.forEach(relations, function(relation) {
    				_.find(records, 'id', _.parseInt(relation[config.via]))[key] = relation;
    			});
    		}));
    });

    return Promise.all(promises).return(records);
	}
};