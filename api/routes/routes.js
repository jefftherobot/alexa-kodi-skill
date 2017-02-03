var appRouter = function(app) {
	var system = require('../controllers/system.js')(),
	    movie = require('../controllers/movie.js')(),
	    tvshow = require('../controllers/tvshow.js')(),
	    alexa = require('../services/alexa.js')();

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