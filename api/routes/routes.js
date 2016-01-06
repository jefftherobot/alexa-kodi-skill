var appRouter = function(app, kodi) {
	var system = require('../controllers/system.js')(kodi);
	var movie = require('../controllers/movie.js')(kodi);
	var tvshow = require('../controllers/tvshow.js')(kodi);

	app.get("/system", system.action);
	app.get("/movie", movie.findByTitle);
	app.get("/tvshow", tvshow.findByTitle);
}

module.exports = appRouter;