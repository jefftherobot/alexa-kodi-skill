var appRouter = function(app, kodi) {
	var system = require('../controllers/system.js')(kodi);
	var alexa = require('../services/alexa.js')(kodi);

	app.post("/alexa", alexa.init);
	app.get("/system/:action", system.action);
/*	app.get("/movie/:title", function(req,res){
		movie.findByTitle(req.params.title, function(foundtitle){
			res.json({ 'movie': foundtitle });
		})
	});*/
	/*	app.get("/tvshow/:title", tvshow.findByTitle);*/
}

module.exports = appRouter;