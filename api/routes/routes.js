var appRouter = function(app, wol, kodi) {
	var system = require('../controllers/system.js');
	var movies = require('../controllers/movie.js');

	app.get("/system", system.action);
	app.get("/movie", movies.findByTitle);
}

module.exports = appRouter;