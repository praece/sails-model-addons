/**
 * Module dependencies
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var util       = require('util');

/**
 * Update One Record
 *
 * An API call to update a model instance with the specified `id`,
 * treating the other unbound parameters as attributes.
 *
 * @param {Integer|String} id  - the unique id of the particular record you'd like to update  (Note: this param should be specified even if primary key is not `id`!!)
 * @param *                    - values to set on the record
 *
 */
module.exports = function updateOneRecord (req, res) {

  // Parse the params, model and required id from the request.
  var Model = actionUtil.parseModel(req);
  var values = actionUtil.parseValues(req);
  var pk = actionUtil.requirePk(req);
  values.id = values.id || pk;

  NestedUpdateService(values, Model)
    .then(function(nestedUpdates) {
      return Model.update(pk, values);
    })
    .then(function(updatedRecords) {
      return Model.findOne(pk).populateAll();
    })
    .then(function(foundRecord) {
      return res.ok(foundRecord);
    })
    .catch(function(err) {
      LogService.error(err, Model.adapter.identity, pk);

      return res.negotiate(err);
    });
};
