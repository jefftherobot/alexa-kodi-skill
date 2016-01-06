module.exports = function(kodi) {
	return {
		findByTitle: function(req, res) {
			var movieTitle = req.params.title;
			console.log(movieTitle)
		}
	}
}