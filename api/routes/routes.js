var appRouter = function(app, kodi) {
	var system = require('../controllers/system.js')(kodi),
	    movie = require('../controllers/movie.js')(kodi),
	    tvshow = require('../controllers/tvshow.js')(kodi),
	    alexa = require('../services/alexa.js')(kodi);

	app.post("/alexa", alexa.init);
	app.get("/system/:action", system.action);
	app.get("/movie/:title", function(req,res){
		movie.findByTitle(req.params.title, function(foundtitle){
			res.json({ 'movie': foundtitle });
		})
	});
	app.get("/tvshow/:title", function(req,res){
		tvshow.findByTitle(req.params.title, function(foundtitle){
			res.json({ 'movie': foundtitle });
		})
	});
}

module.exports = appRouter;