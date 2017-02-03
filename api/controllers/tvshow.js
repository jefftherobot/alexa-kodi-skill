var google = require('google')
google.resultsPerPage = 5;

function addEpisodesToPlaylist(id){
		kodi.VideoLibrary.GetEpisodes({ 'tvshowid': id, 'limits': { 'start' : 0, 'end': 30 }, 'sort': { 'order': 'ascending', 'method': 'random'} })
		.then(function(data) {

			//console.log(data)
			var counter = 0;

			kodi.Playlist.Clear({playlistid:1})

			data.result.episodes.forEach(function(ep, i) {
				kodi.Playlist.Add({playlistid:1, item:{episodeid:ep.episodeid}}).then(function(item){
					counter++;
					if(counter==30){
						kodi.Player.Open({item: { playlistid: 1 }});
						kodi.Playlist.GetItems({playlistid:1}).then(function(items){
							console.log(items)
						})
					}

				})
			})

		})
	}

module.exports = function() {
	return {
		findByTitle: function(tvshowTitle, callback) {

			kodi.VideoLibrary.GetTVShows({'properties':['imdbnumber']})
			.then(function(tvshows) {

				if(!(tvshows && tvshows.result && tvshows.result.tvshows && tvshows.result.tvshows.length > 0)) {
					callback("I can't seem to retrieve a show listing.")
				}

				var tvshow;

				//try exact match
				tvshow = tvshows.result.tvshows.reduce(function(result, item) {
					var label = item.label.toLowerCase().replace(/[&\/\\#,+\-()$~%.'":*?<>{}]/g, '');
					return result ? result : (tvshowTitle === label ? item : null);
				}, null);

				console.log(tvshow)


				if(tvshow){
					addEpisodesToPlaylist(tvshow.tvshowid)
					callback('Ok. Playing random episodes from '+tvshow.label)
				}else{
					//try google
					google('site:thetvdb.com '+tvshowTitle, function (err, next, links){
						var firstResult = links[0],
						    TVDBID = firstResult.link.split(/\id=([0-9]+)/)[1]

						//console.log(links);
						//console.log(TVDBID);

						tvshow = tvshows.result.tvshows.reduce(function(result, item) {
							return result ? result : (TVDBID == item.imdbnumber ? item : null);
						}, null);

						console.log(tvshow)

						if(tvshow){
							addEpisodesToPlaylist(tvshow.tvshowid)
							callback('Ok. Playing random episodes from '+tvshow.label)
						}else{
							//quasar maybe?
							callback("Sorry I coun't find that show.");
							//var label = firstResult.title.split(/[ ]\(.*/)[0]
							//kodi.Player.Open({item: {"file":"plugin://plugin.video.quasar/show/"+TVDBID+"/season/<SEASON>/episode/<EPISODE>/play"}})
							//callback('Ok. Playing random episode from '+tvshow.label+' with quasar.')
						}
					})
				}
			})
			.catch(function(e) {
				callback("I can't seem to connect to Kodi. Is it on?")
			});
		}
	}
}