const path = require('path')
const express = require('express')
const Constants = require('./../common/constants')
const CollectionsProvider = require('./../models/Collection.model');
const PortfoliosProvider = require('./../models/Portfolio.model');
const portfolio = new PortfoliosProvider.PortfolioModel()

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
// set default express engine and extension
var router = express.Router()

/** Portfolio **/
router.get('/category/all', function (req, res) {
  res.render(path.join(__dirname + '/../../views/pages/album'), {
    params: req.params,
    portfolios: portfolio.getCollections()
  })
})

router.get('/category/*', function (req, res) {
  const category = req.params[0]
  const generated_collection = new CollectionsProvider.CollectionModel(category)

  res.render(path.join(__dirname + '/../../views/pages/album'), {
    params: req.params,
    collection: generated_collection,
    portfolios: portfolio.getCollections()
  })
})

module.exports = router;