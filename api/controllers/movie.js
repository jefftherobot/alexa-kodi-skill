module.exports = function(kodi) {
	return {
		findByTitle: function(movieTitle, callback) {
			var foundTitle = movieTitle;
			callback(foundTitle)
		}
	}
}