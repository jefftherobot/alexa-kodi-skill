module.exports = function(kodi) {
	return {
		findByTitle: function(req, res) {
			var tvshowTitle = req.params.title;
			console.log(tvshowTitle)
		}
	}
}