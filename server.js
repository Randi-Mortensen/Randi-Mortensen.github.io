// load de ting vi skal bruge
const express = require("express");
const server = express();
const bodyParser = require("body-parser");// Typisk form data
const session    = require('express-session');

//Indstille Server
// set the view engine to ejs
//css og images skal ligge under public for serveren kan finde dem
server.set("view engine", "ejs");
server.set("port", process.env.PORT || 3000);

server.use(express.static("public"));
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 5 * 60 * 1000 } // 5 minutter
}));
// brug res.render til at uploade en ejs view file
// Import routes
//Husk og require for hver ny side du laver
require("./routes/index")(server);

var url = "http://localhost:",
    port = server.get('port'),
    name = "Slipseknuden";

server.listen(3000, function () {
    console.log('Server listening at: ' + url+port+"/", '\n' + 'Server name: ' + name);
});
