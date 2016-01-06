var appRouter = function(app, wol, Kodi) {

/*	var kodi = new Kodi('192.168.0.175', '80');*/
var kodi = new Kodi('192.168.0.239', '80');

	app.get("/", function(req, res) {
		res.send("Welcome to kodi");
	});

	app.get("/system", function(req, res) {
		var action = req.query.action;

		switch(action){
			case 'on':
				res.json({ message: 'Turning T.V. on' }); 
				console.log('turning tv on...')
				wake_kodi();
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
				}
			})
			.catch(function(e) {
				console.log(e);
				res.json({ message: 'I can\'t seem to connect to Kodi. Let me try and turn the T.V on.' });
				wake_kodi();
			});

	});

	app.get("/tvshow", function(req, res) {
		var tvshowTitle = req.query.title;


		kodi.VideoLibrary.GetTVShows()
			.then(function(tvshows) {
				//console.log(tvshows)
				if(!(tvshows && tvshows.result && tvshows.result.tvshows && tvshows.result.tvshows.length > 0)) {
					res.json({ message: 'I can\'t seem to retrieve a show listing' }); 
				}

				var tvshow = tvshows.result.tvshows.reduce(function(result, item) {
					//console.log(item.label)
					var label = item.label.toLowerCase().replace(/[&\/\\#,+!\-()$~%.'":*?<>{}]/g, '')
					return result ? result : (tvshowTitle === label ? item : null);
				}, null);

				if(tvshow){
					res.json({ message: 'Sure. Playing random episodes from '+tvshow.label });
					playEpisodes(tvshow.tvshowid)
				}else{
					res.json({ message: 'Show not found '+tvshowTitle }); 
				}

			})
			.catch(function(e) {
				console.log(e);
				res.json({ message: 'I can\'t seem to connect to Kodi. Let me try and turn the T.V on.' });
				wake_kodi();
			});

	});

	function playEpisodes(id){
		kodi.VideoLibrary.GetEpisodes({ 'tvshowid': id, 'limits': { 'start' : 0, 'end': 30 }, 'sort': { 'order': 'ascending', 'method': 'random'} })
		.then(function(eps) {
			
			kodi.Playlist.Clear({playlistid:1})
			
			eps.result.episodes.forEach(function(ep) {
				kodi.Playlist.Add({playlistid:1, item:{episodeid:ep.episodeid}}).then(function(i){
					success++;
				})
			})

			setTimeout(function(){
				kodi.Player.Open({item: { playlistid: 1 }});
				kodi.Playlist.GetItems({playlistid:1}).then(function(items){
				//console.log(items)
			})
			},500)

		})
	}

	function wake_kodi(){
		wol.wake('80:EE:73:63:F0:5A',{ address: '192.168.0.255'});
	}
}
 
module.exports = appRouter;