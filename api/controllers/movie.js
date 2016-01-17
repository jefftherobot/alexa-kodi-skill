var google = require('google')
google.resultsPerPage = 25;

module.exports = function(kodi) {
	return {
		findByTitle: function(movieTitle, callback) {
			var foundTitle = movieTitle;

			google('movie '+movieTitle, function (err, next, links){
				console.log(links)
			})
			
			kodi.VideoLibrary.GetMovies({'properties':['imdbnumber']})
			.then(function(movies) {
				//console.log(movies)
				if(!(movies && movies.result && movies.result.movies && movies.result.movies.length > 0)) {
				//	res.json({ message: 'I can\'t seem to retrieve a movie listing' });
					callback("'I can't seem to retrieve a movie listing.")
				}

				var movie = movies.result.movies.reduce(function(result, item) {

					//var label = item.label.toLowerCase().replace(/[&\/\\#,+\-()$~%.'":*?<>{}]/g, '')
					//return result ? result : (movieTitle === label ? item : null);
				}, null);
/*
				var movie = movies.result.movies.reduce(function(result, item) {
					var label = item.label.toLowerCase().replace(/[&\/\\#,+\-()$~%.'":*?<>{}]/g, '')
					return result ? result : (movieTitle === label ? item : null);
				}, null);

				if(movie) {
					res.json({ message: 'Sure, Playing '+movie.label });
					return kodi.Player.Open({item: { movieid: movie.movieid }});
				} else {
					res.json({
						message: 'I can\'t find the movie '+movieTitle,
						reprompt: 'You can ask me what movie you want to watch by saying, watch and then the exact movie title'
					});
				}*/
			})
			.catch(function(e) {
				callback("I can't seem to connect to Kodi.")
				//console.log(e);
			//	res.json({ message: 'I can\'t seem to connect to Kodi. Let me try and turn the T.V on.' });
				//wake_kodi();
			});

			//callback(foundTitle)
		}
	}
}