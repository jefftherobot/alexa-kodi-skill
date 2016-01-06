var express = require("express"),
    wol = require('wake_on_lan'),
    Kodi = require('kodi-rpc'),
    app = express(),
    kodi = new Kodi('192.168.0.239', '80'),
    routes = require("./routes/routes.js")(app, wol, kodi);

var nomo = require('node-monkey').start();

var server = app.listen(3000, function () {
	console.log("Listening on port %s...", server.address().port);
});