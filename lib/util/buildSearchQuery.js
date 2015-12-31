var _ = require('lodash');

module.exports = function buildSearchQuery(q, Model) {
	// If there is no search query or no defined searchable fields just return nothing.
	if (!q || _.isEmpty(Model.searchableFields)) return;

	var or = [];

	// Add criteria for each searchable fields.
	_.forEach(Model.searchableFields, function(field) {
		var type = Model._attributes[field].type;
		var criteria = {};

		// You can't run contains on numbers, so we'll just search strings for now.
		if (_.contains(['text', 'string'], type)) criteria[field] = {contains: q};
		or.push(criteria);
	});

	return {or: or};
};