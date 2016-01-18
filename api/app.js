var express = require("express"),
    bodyParser = require('body-parser'),
    Kodi = require('kodi-rpc'),
    app = express(),
    kodi = new Kodi('192.168.0.239', '80');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var routes = require("./routes/routes.js")(app, kodi);

var nomo = require('node-monkey').start();

var server = app.listen(3000, function () {
	console.log("Listening on port %s...", server.address().port);
});