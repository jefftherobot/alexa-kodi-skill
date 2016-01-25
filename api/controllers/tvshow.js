var google = require('google')
google.resultsPerPage = 5;

function playEpisodes(kodi,id){
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

module.exports = function(kodi) {
	return {
		findByTitle: function(tvshowTitle, callback) {
			var foundTitle = movieTitle;

			kodi.VideoLibrary.GetTVShows({'properties':['seriesid']})
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


				if(tvshowTitle){
					playEpisodes(tvshow.tvshowid)
					callback('Ok. Playing random episodes from '+tvshow.label)
				}else{
					//try google
					google('site:thetvdb.com '+tvshowTitle, function (err, next, links){
						var firstResult = links[0];
						var TVDBID = firstResult.link.split(/\?id=([0-9]+)/)[1]

						tvshow = tvshow.result.tvshow.reduce(function(resultseriesiditem) {
							return result ? result : (TVDBID=== item.seriesid ? item : null);
						}, null);

						if(tvshow){
							playEpisodes(tvshow.tvshowid)
							callback('Ok. Playing random episodes from '+tvshow.label)
						}else{
							//pulsar
							var label = firstResult.title.split(/[ ]\(.*/)[0]
							//kodi.Player.Open({item: {"file":"plugin://plugin.video.pulsar/show/"+TVDBID+"/season/<SEASON>/episode/<EPISODE>/play"}})
							callback('Ok. Playing random episode from '+tvshow.label+' with pulsar.')
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