const http = require('http');
const path = require('path');
const nunjucks = require('nunjucks')
const express = require('express');

const cookieParser = require('cookie-parser');
const i18n = require('i18n');

const SEPARATOR = "\\"
// const SEPARATOR = "/"

i18n.configure({
  // setup some locales - other locales default to en silently
  locales: ['en', 'fr'],
  queryParameter: "lang",
  // sets a custom cookie name to parse locale settings from
  cookie: 'lang_cookie_name',

  // where to store json files - defaults to './locales'
  directory: __dirname + SEPARATOR + 'client' + SEPARATOR + 'assets' + SEPARATOR + 'locales'
});

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
// set default express engine and extension
var app = express();
app.set('views', __dirname + '/client');
app.set('view engine', 'nunjucks');

// app.use('/pages', express.static(path.resolve(__dirname, 'client', 'pages')));
// app.use(express.static(path.resolve(__dirname, 'client', 'assets', 'css')));
// app.use(express.static(path.resolve(__dirname, 'client', 'assets', 'img')));
// app.use(express.static(path.resolve(__dirname, 'client', 'assets', 'js')));
// app.use(express.static(path.resolve(__dirname, 'client', 'assets', 'vendor')));

/** Locales **/
// you will need to use cookieParser to expose cookies to req.cookies
app.use(cookieParser());

// i18n init parses req for language headers, cookies, etc.
app.use(i18n.init);

// configure nunjucks environment
env = nunjucks.configure('client', {
  express: app,
  autoescape: true
})
env.addGlobal("__", i18n.__);
env.addFilter("t", i18n.__);

// Serving static files
app.use(express.static('client'));
app.use('/services', express.static('client'));
app.use('/portfolio/category', express.static('client'));
// app.use(express.static(path.resolve(__dirname, 'client', 'pages')));
// app.use(express.static(path.resolve(__dirname, 'client', 'templates')));

app.engine('njk', nunjucks.render)


var server = http.createServer(app);

app.get("/", function (req, res)
{
  res.render(path.join(__dirname + "/client/pages/index"), {})
})
app.get("/home", function (req, res)
{
  res.render(path.join(__dirname + "/client/pages/index"), {})
})

/** Informations */
app.get("/about", function (req, res)
{
  res.render(path.join(__dirname + "/client/pages/about-me"), {})
})
app.get("/contact", function (req, res)
{
  res.render(path.join(__dirname + "/client/pages/contact"), {})
})
app.get("/informations/media", function (req, res)
{
  res.render(path.join(__dirname + "/client/pages/info-media"), {})
})
app.get("/informations/equipment", function (req, res)
{
  res.render(path.join(__dirname + "/client/pages/info-equipment"), {})
})

/** Services **/
app.get("/services/portraying", function (req, res)
{
  res.render(path.join(__dirname + "/client/pages/services-portraying"), {})
})
app.get("/services/printing", function (req, res)
{
  res.render(path.join(__dirname + "/client/pages/services-printing"), {})
})
app.get("/services/licensing", function (req, res)
{
  res.render(path.join(__dirname + "/client/pages/services-licensing"), {})
})
app.get("/services/editing", function (req, res)
{
  res.render(path.join(__dirname + "/client/pages/services-editing"), {})
})

/** Portfolio **/
app.get("/portfolio/category/all", function (req, res)
{
  res.render(path.join(__dirname + "/client/pages/album"), {})
})

app.get("/portfolio/category/*", function (req, res)
{
  res.render(path.join(__dirname + "/client/pages/album"), { params : req.params, portfolio : req.query})
})

app.get("/blog", function (req, res)
{
  res.send("blog page");
})


// ***********************

console.log('Booting up the server! Please wait until finished...')
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("All ready! Server listening at", addr.address + ":" + addr.port);
});
