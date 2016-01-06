module.exports = function(kodi) {
	return {
		findByTitle: function(req, res) {
			var tvshowTitle = req.query.title;
			console.log(tvshowTitle)
		}
	}
}