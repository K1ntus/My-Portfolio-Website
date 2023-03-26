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

/** Informations */
router.get('/media', function (req, res) {
  res.render(path.join(__dirname + '/../../views/pages/info-media'), {
    params: req.params,
    portfolios: portfolio.getCollections()
  })
})
router.get('/equipment', function (req, res) {
  res.render(path.join(__dirname + '/../../views/pages/info-equipment'), {
    params: req.params,
    portfolios: portfolio.getCollections()
  })
})


module.exports = router;