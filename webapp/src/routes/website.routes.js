const path = require('path')
const express = require('express')
const Constants = require('./../common/constants')
const PortfoliosProvider = require('./../models/Portfolio.model');
const portfolio = new PortfoliosProvider.PortfolioModel(__dirname + './../../' + Constants.COLLECTION_ROOT_PATH)

const handler = (req, res, template) => {
  res.render(template)
}
//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
// set default express engine and extension
var router = express.Router()
// app.use('/services', express.static('views'))
// app.use('/portfolio/category', express.static('views'))
// app.use('/informations', express.static('views'))

/**  Home  **/
router.get('/', function (req, res) {
  // console.log(req)
  res.render(path.join(__dirname + '/../../views/pages/index'), {
    params: req.params,
    portfolios: portfolio.getCollections()
  })
})
router.get('/home', function (req, res) {
  res.render(path.join(__dirname + '/../../views/pages/index'), {
    params: req.params,
    portfolios: portfolio.getCollections()
  })
})
router.get('/about', function (req, res) {
  res.render(path.join(__dirname + '/../../views/pages/about-me'), {
    params: req.params,
    portfolios: portfolio.getCollections()
  })
})
router.get('/contact', function (req, res) {
  res.render(path.join(__dirname + '/../../views/pages/contact'), {
    params: req.params,
    portfolios: portfolio.getCollections()
  })
})

module.exports = router;