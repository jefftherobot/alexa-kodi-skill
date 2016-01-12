module.exports = function(kodi) {
	return {
		findByTitle: function(showTitle, callback) {
			var foundTitle = showTitle;
			callback(foundTitle)
		}
	}
}