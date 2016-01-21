/**
 * Module dependencies
 */
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var _          = require('lodash');

/**
 * Find Records
 *
 *  get   /:modelIdentity
 *   *    /:modelIdentity/find
 *
 * An API call to find and return model instances from the data adapter
 * using the specified criteria.  If an id was specified, just the instance
 * with that unique id will be returned.
 *
 * Optional:
 * @param {Object} where       - the find criteria (passed directly to the ORM)
 * @param {Integer} limit      - the maximum number of records to send back (useful for pagination)
 * @param {Integer} skip       - the number of records to skip (useful for pagination)
 * @param {String} sort        - the order of returned records, e.g. `name ASC` or `age DESC`
 * @param {String} callback - default jsonp callback param (i.e. the name of the js function returned)
 */

module.exports = function findRecords (req, res) {

  // Look up the model.
  var Model = actionUtil.parseModel(req);
  var where = actionUtil.parseCriteria(req);
  var q = where.q;
  delete where.q;

  // If an `id` param was specified, use the findOne blueprint action
  // to grab the particular instance with its primary key === the value
  // of the `id` param.   (mainly here for compatibility for 0.9, where
  // there was no separate `findOne` action).
  if ( actionUtil.parsePk(req) ) {
    return require('./findOne')(req,res);
  }

  // Lookup for records that match the specified criteria.
  var query = Model.search(q)
    .where(where)
    .limit(actionUtil.parseLimit(req))
    .skip(actionUtil.parseSkip(req))
    .sort(actionUtil.parseSort(req));

  query = actionUtil.populateEach(query, req);

  query
    .then(Model.afterFind)
    .then(function(records) {
      return res.ok(records);
    })
    .catch(function(err) {
      sails.log.error('Error during findRecords.', {error: err, model: Model.adapter.identity, where: where});
      
      return res.serverError(err);
    });
};
