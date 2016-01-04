var is      = require('is_js');
var Promise = require('bluebird');

module.exports.models = {
	types: {
    validateUnique: function(value, count) {
      return count ? false : true;
    },
    isEmail: function(value) {
      return is.email(value);
    },
    isPhone: function(value) {
      return is.nanpPhone(value);
    },
    isZip: function(value) {
      return is.usZipCode(value);
    }
  },

	searchableFields: [],
  defaultWhere: {},
  nestedDelete: [],
  backReference: [],
  calculatedFields: [],

  search: require('../lib/search.js'),
  searchCount: require('../lib/searchCount.js'),

  afterFind: function(records) {
    return Promise
      .all([
        require('../lib/backReference.js').populate(records, this),
        require('../lib/calculatedFields.js').populate(records, this)
      ])
      .then().return(records);
  },

  afterDestroy: function(records, cb) {
    return require('../lib/nestedDelete.js').process(records, this)
      .then(function() {
        cb();
      })
      .catch(cb);
  }
};