var appRouter = function(app, wol, Kodi) {

	var kodi = new Kodi('192.168.0.175', '80');
	
	app.get("/", function(req, res) {
		res.send("Welcome to kodi");
	});

	app.get("/system", function(req, res) {
		var action = req.query.action;

		switch(action){
			case 'on':
				res.json({ message: 'Turning T.V. on' }); 
				console.log('turning tv on...')
				wol.wake('80:EE:73:63:F0:5A',{ address: '192.168.0.255'});
				break;
			case 'off':
				res.json({ message: 'Turning T.V. off' }); 
				console.log('turning tv off...')
				kodi.System.Suspend();
				break;
			case 'stop':
				res.json({ message: 'Stopping' }); 
				console.log('stopping.')
				kodi.Player.Stop({'playerid':1});
				break;
			default:
				res.json({ message: 'System command not found' }); 
				break;
		}
	})

	app.get("/movie", function(req, res) {
		var movieTitle = req.query.title;

		kodi.VideoLibrary.GetMovies()
			.then(function(movies) {
				if(!(movies && movies.result && movies.result.movies && movies.result.movies.length > 0)) {
					res.json({ message: 'I can\'t seem to retrieve a movie listing' }); 
				}

				var movie = movies.result.movies.reduce(function(result, item) {
					return result ? result : (movieTitle === item.label.toLowerCase() ? item : null);
				}, null);

				if(movie) {
					res.json({ message: 'Playing '+movie.label }); 
					return kodi.Player.Open({item: { movieid: movie.movieid }});
				} else {
					res.json({ 
						message: 'I can\'t find the movie '+movieTitle,
						reprompt: 'You can ask me what movie you want to watch by saying, watch and then the exact movie title'
					}); 
				}
			})
			.catch(function(e) {
				console.log(e);
				res.json({ message: 'I can\'t seem to connect to Kodi. Let me try and turn the T.V on.' });
				wol.wake('80:EE:73:63:F0:5A');
			});

	});
}
 
module.exports = appRouter;