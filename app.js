var server = require('./server/server');

var app = new server.WebServer();
app.startHttpServer();