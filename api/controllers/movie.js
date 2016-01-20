var google = require('google')
google.resultsPerPage = 5;

module.exports = function(kodi) {
	return {
		findByTitle: function(movieTitle, callback) {
			var foundTitle = movieTitle;
			
			kodi.VideoLibrary.GetMovies({'properties':['imdbnumber']})
			.then(function(movies) {

				if(!(movies && movies.result && movies.result.movies && movies.result.movies.length > 0)) {
					callback("I can't seem to retrieve a movie listing.")
				}

				var movie;

				//try exact match
				movie = movies.result.movies.reduce(function(result, item) {
					var label = item.label.toLowerCase().replace(/[&\/\\#,+\-()$~%.'":*?<>{}]/g, '');
					return result ? result : (movieTitle === label ? item : null);
				}, null);

				
				if(movie){
					kodi.Player.Open({item: { movieid: movie.movieid }});
					callback("Playing "+movie.label)
				}else{
					//try google
					google('site:imdb.org movie '+movieTitle, function (err, next, links){
						var firstResult = links[0];
						var IMDBid = firstResult.link.match(/\d{7}/).toString();

						movie = movies.result.movies.reduce(function(result, item) {
							return result ? result : ('tt'+IMDBid === item.imdbnumber ? item : null);
						}, null);
						
						if(movie){
							kodi.Player.Open({item: { movieid: movie.movieid }});
							callback("Playing "+movie.label)
						}else{
							//pulsar
							var label = firstResult.title.split(/[ ]\(.*/)[0]
							kodi.Player.Open({item: {"file":"plugin://plugin.video.pulsar/movie/tt"+IMDBid+"/play"}})
							callback("Playing "+label+" with pulsar.")
						}
					})
				}
			})
			.catch(function(e) {
				callback("I can't seem to connect to Kodi.")
			});
		}
	}
}