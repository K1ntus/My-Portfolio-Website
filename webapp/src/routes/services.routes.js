const path = require('path')
const express = require('express')
const Constants = require('./../common/constants')
const PortfoliosProvider = require('./../models/Portfolio.model');
const portfolio = new PortfoliosProvider.PortfolioModel(__dirname + './../../' + Constants.COLLECTION_ROOT_PATH)

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
// set default express engine and extension
var router = express.Router()

/** Services **/
router.get('/portraying', function (req, res) {
  res.render(path.join(__dirname + '/../../views/pages/services-portraying'), {
    params: req.params,
    portfolios: portfolio.getCollections()
  })
})
router.get('/printing', function (req, res) {
  res.render(path.join(__dirname + '/../../views/pages/services-printing'), {
    params: req.params,
    portfolios: portfolio.getCollections()
  })
})
router.get('/licensing', function (req, res) {
  res.render(path.join(__dirname + '/../../views/pages/services-licensing'), {
    params: req.params,
    portfolios: portfolio.getCollections()
  })
})
router.get('/editing', function (req, res) {
  res.render(path.join(__dirname + '/../../views/pages/services-editing'), {
    params: req.params,
    portfolios: portfolio.getCollections()
  })
})
module.exports = router;