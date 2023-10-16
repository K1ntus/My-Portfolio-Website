const http = require('http')
const path = require('path')
const nunjucks = require('nunjucks')
const express = require('express')

const cookieParser = require('cookie-parser')
const i18n = require('i18n')

const Constants = require('./src/common/constants')

// const Constants.SEPARATOR = '/'
// const Constants.SEPARATOR = "/"

i18n.configure({
  // setup some locales - other locales default to en silently
  locales: ['en', 'fr'],
  queryParameter: 'lang',
  defaultLocale : "fr",
  // sets a custom cookie name to parse locale settings from
  cookie: 'lang_cookie_name',
  mustacheConfig: {
    tags: ['[[[', ']]]']
  },

  // where to store json files - defaults to './locales'
  directory: path.join(__dirname, "views", 'locales')
})


//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
// set default express engine and extension
var app = express()
app.set('views', __dirname + '/views')
app.set('view engine', 'nunjucks')

// app.use('/pages', express.static(path.resolve(__dirname, 'views', 'pages')));
// app.use(express.static(path.resolve(__dirname, 'views', 'assets', 'css')));
// app.use(express.static(path.resolve(__dirname, 'views', 'assets', 'img')));
// app.use(express.static(path.resolve(__dirname, 'views', 'assets', 'js')));
// app.use(express.static(path.resolve(__dirname, 'views', 'assets', 'vendor')));

/** Locales **/
// you will need to use cookieParser to expose cookies to req.cookies
app.use(cookieParser())

// i18n init parses req for language headers, cookies, etc.
app.use(i18n.init)

// configure nunjucks environment
env = nunjucks.configure('views', {
  express: app,
  autoescape: true
})
env.addGlobal('__', i18n.__)
env.addFilter('t', i18n.__)

// Serving static files
app.use(express.static('views'))
app.use('/services', express.static('views'))
app.use('/portfolio/category', express.static('views'))
app.use('/informations', express.static('views'))
// app.use('/kibana', express.static('views'))
// app.use(express.static(path.resolve(__dirname, 'views', 'pages')));
// app.use(express.static(path.resolve(__dirname, 'views', 'templates')));

app.engine('njk', nunjucks.render)

var server = http.createServer(app)

// ***********************
app.use('/', require('./src/routes/website.routes'))
app.use('/services', require('./src/routes/services.routes'))
app.use('/portfolio', require('./src/routes/portfolio.routes'))
app.use('/informations', require('./src/routes/informations.routes'))
// app.use('/kibana', require('./src/drivers/analytics/routes/elastic.routes'))
// ***********************


// ***********************

const Path = require('path')
const FS = require('fs')
let Files = []

function ThroughDirectory (Directory) {
  FS.readdirSync(Directory).forEach(File => {
    const Absolute = Path.join(Directory, File)
    if (FS.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute)
    else return Files.push(Absolute)
  })
}


function fill_images_path (root_dir, data_structure) {
  ThroughDirectory('views/assets/img/collections')
  console.log(Files)
}

// ***********************

const photo_index_name = "photography"
async function initElasticSearchIndex(index_name)
{
  const elasticClient = require('./src/drivers/analytics/client/elastic.client')
  if(elasticClient.ping())
  {
    console.log("toto")
    if (elasticClient.indexExists({}, {}, index_name))
    {
      console.log("toto")
      if (elasticClient.initIndex({}, {}, index_name))
      {
        console.log("toto")
        elasticClient.initMapping({}, {}, index_name, "client.ip", "ip")
        elasticClient.initMapping({}, {}, index_name, "client.locale", "text")
        elasticClient.initMapping({}, {}, index_name, "client.type", "text")
        elasticClient.initMapping({}, {}, index_name, "client.browser", "text")
        elasticClient.initMapping({}, {}, index_name, "client.operating_system", "text")
        elasticClient.initMapping({}, {}, index_name, "client.request.date", "date")
        elasticClient.initMapping({}, {}, index_name, "client.url.origin", "text")
        elasticClient.initMapping({}, {}, index_name, "client.url.destination", "text")
        console.log("toto")
      }
    }
  }

  
}

initElasticSearchIndex(photo_index_name)
console.log('Booting up the server! Please wait until finished...')
server.listen(
  process.env.PORT || 3000,
  process.env.IP || '0.0.0.0',
  function () {
    var addr = server.address()
    console.log(
      'All ready! Server listening at',
      addr.address + ':' + addr.port
    )
  }
)

// ******************
// *      TESTS     *
// ******************
// fill_images_path()
// let Images = require('./src/models/Image.model');
// const img_test = new Images.ImageModel('./../../views/assets/img/collections/history/museums/guimet/20220526141702_IMG_4489.JPG');
// const img_test = new img.ImageModel('./../../views/assets/img/collections/macro/hongkong/IMG_7393.jpg');
// img_test.readAllMetadatasOfImage();
// let img_test = new image.Ima

// console.log("path: ", Constants.COLLECTION_ROOT_PATH)
// let Collections = require('./src/models/Collection.model');
// const collection_test = new Collections.CollectionModel('history')

// KIBANA / ELK
// curl -s -H 'Content-Type: application/json' -XPOST http://localhost:9200/simple-index/data -d @simple-message.json

// let message = {type:"simple", message:"msg toto", random: "some random things"}
// const ELK_URL = "http://localhost:9200/"
// var request = require('request');

// request.post(
//     'http://www.yoursite.com/formpage',
//     { json: { key: 'value' } },
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             console.log(body);
//         }
//     }
// );