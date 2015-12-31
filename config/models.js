var is = require('is_js');

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
	search: require('../lib/search.js'),
	searchCount: require('../lib/searchCount.js')
};