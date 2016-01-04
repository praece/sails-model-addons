/**
 * Module dependencies
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var _       	 = require('lodash');

/**
 * Create Record
 *
 * post /:modelIdentity
 *
 * An API call to find and return a single model instance from the data adapter
 * using the specified criteria.  If an id was specified, just the instance with
 * that unique id will be returned.
 *
 * Optional:
 * @param {String} callback - default jsonp callback param (i.e. the name of the js function returned)
 * @param {*} * - other params will be used as `values` in the create
 */
module.exports = function createRecord (req, res) {

	// Parse the params and model from the request.
	var Model = actionUtil.parseModel(req);
	var data = actionUtil.parseValues(req);

	// Create new instance of model using data from params.
	Model.create(data)
		.then(function(newRecord) {
			return Model.findOne(newRecord.id).populateAll();
		})
		.then(function(foundRecord) {
			return res.created(foundRecord);
		})
		.catch(function(err) {
			LogService.error(err, Model.adapter.identity);

			if (!err.originalError || !_.isArray(err.originalError)) return res.negotiate(err);

			// If there was an error on insert of something other than the main
			// record we are creating delete the main record. This should cascade
			// deletes down to the other records as necessary.
			Model.destroy({id: err.originalError[0].values[Model.adapter.collection]})
				.exec(function(deleteErr, deleted) {
					return res.negotiate(err);
				})
		});
};