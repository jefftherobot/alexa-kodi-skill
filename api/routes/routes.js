var appRouter = function(app, kodi) {
	var alexa = require('../controllers/alexa.js')();
	var system = require('../controllers/system.js')(kodi);
	var movie = require('../controllers/movie.js')(kodi);
	var tvshow = require('../controllers/tvshow.js')(kodi);

	app.post("/", alexa.init);
	app.get("/system/:action", system.action);
	app.get("/movie/:title", movie.findByTitle);
	app.get("/tvshow/:title", tvshow.findByTitle);
}

module.exports = appRouter;