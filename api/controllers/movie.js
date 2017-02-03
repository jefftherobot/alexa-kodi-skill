var google = require('google'),
    kodi = require('kodi-ws');

google.resultsPerPage = 5;

module.exports = function() {
	return {
		findByTitle: function(movieTitle, callback) {
			kodi(process.env.KODI_IP, process.env.KODI_PORT).then(function (connection) {

				var movies = connection.VideoLibrary.GetMovies({'properties':['imdbnumber']});

				if(!(movies && movies.result && movies.result.movies && movies.result.movies.length > 0)) {
					//callback("I can't seem to retrieve a movie listing or library empty.");
				}

				var movie;

				console.log(movies)

				//try exact match

				if(movies.length>0){
					movie = movies.result.movies.reduce(function(result, item) {
						var label = item.label.toLowerCase().replace(/[&\/\\#,+\-()$~%.'":*?<>{}]/g, '');
						return result ? result : (movieTitle === label ? item : null);
					}, null);
				}


				if(movie){
					connection.Player.Open({item: { movieid: movie.movieid }});
					callback("Playing "+movie.label)
				}else{
					//try google
					google('site:imdb.org movie '+movieTitle, function (err, next, links){
						var firstResult = links[0];
						var IMDBid = firstResult.link.match(/\d{7}/).toString();

						console.log(firstResult, IMDBid)

						//Check for movie in library again, but this time by imdbid

						if(movies.length>0){
						movie = movies.result.movies.reduce(function(result, item) {
							return result ? result : ('tt'+IMDBid === item.imdbnumber ? item : null);
						}, null);

					}

						if(movie){
							//kodi.Player.Open({item: { movieid: movie.movieid }});
							callback("Playing "+movie.label)
						}else{
							//quasar
							var label = firstResult.title.split(/[ ]\(.*/)[0];
							callback("Playing "+label+" with quasar.")
							return connection.Player.Open({item: {"file":"plugin://plugin.video.quasar/movie/tt"+IMDBid+"/play"}})
						}
					})
				}

				/* Mute */
			//	return connection.Application.SetMute(false);

			}).catch(function(e) {
				/* Handle errors */
				if(e.stack) {
					console.error(e.stack);
				} else {
					console.error(e);
				}
			}).then(function() {
				/* Finally exit this process */
				//process.exit();
			});


		}
	}
}