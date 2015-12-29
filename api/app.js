var express = require("express"),
    wol = require('wake_on_lan'),
    Kodi = require('kodi-rpc'),
    app = express(),
    routes = require("./routes/routes.js")(app, wol, Kodi);

var server = app.listen(3000, function () {
	console.log("Listening on port %s...", server.address().port);
});