var buildSearchQuery = require('./util/buildSearchQuery');

module.exports = function search(q) {
	var query = buildSearchQuery(q, this);

	return this.count(query);
};