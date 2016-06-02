require('dotenv').config();

var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    express = require("express"),
    bodyParser = require('body-parser'),
    Kodi = require('kodi-rpc');

var env = process.env.NODE_ENV || 'development';
var kodi = new Kodi(process.env.KODI_IP, process.env.KODI_PORT);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var routes = require("./routes/routes.js")(app, kodi);

if (env !== 'production') {

	require('node-monkey').start();
	http.createServer(app).listen(3000,  function(){
		console.log("Express server listening on port 3000");
	});

}else{

	var httpsOptions  = {
		key: fs.readFileSync(process.env.SSL_KEY),
		cert: fs.readFileSync(process.env.SSL_CERT),
	};

	https.createServer(httpsOptions, app).listen(443, function(){
		console.log("Express SSL server listening on port 443");
	});

	//For internal traffic

	http.createServer(app).listen(3000,  function(){
		console.log("Express server listening on port 3000");
	});
}