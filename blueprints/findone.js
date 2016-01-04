/**
 * Module dependencies
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

/**
 * Find One Record
 *
 * get /:modelIdentity/:id
 *
 * An API call to find and return a single model instance from the data adapter
 * using the specified id.
 *
 * Required:
 * @param {Integer|String} id  - the unique id of the particular instance you'd like to look up *
 *
 * Optional:
 * @param {String} callback - default jsonp callback param (i.e. the name of the js function returned)
 */

module.exports = function findOneRecord (req, res) {

  // Look up the model.
  var Model = actionUtil.parseModel(req);
  var pk = actionUtil.requirePk(req);

  // Look up the specific record based on the primary key.
  Model.findOne(pk).populateAll()
    .then(function(record) {
      if (!record) return res.notFound('No record found with the specified `id`.');
      
      return Model.afterFind(record);
    })
    .then(function(record) {
      return res.ok(record);
    })
    .catch(function(err) {
      LogService.error(err);
      
      return res.serverError(err);
    });
};
