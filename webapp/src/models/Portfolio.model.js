const Constants = require('../common/constants')
const CommonFunctions = require('../common/functions')

class PortfolioModel
{
  constructor ()
  {
    this._root_directory = __dirname + "/../../" + Constants.COLLECTION_ROOT_PATH
    this._collections = [];
    this.buildCollectionsList()
  }

  //  ***********************


  buildCollectionsList()
  {
    this._collections = this.callForCollectionsList(this._root_directory)
  }

  callForCollectionsList(root_directory)
  {
    var fs = require('fs');

    const getDirectories = root_directory =>
    fs.readdirSync(root_directory, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

    return getDirectories(root_directory)
  }

  getCollections()
  {
    return this._collections
  }


  
  buildJson()
  {
    let result = JSON.stringify(this._collections, null, 2)
    return result
  }
}

exports.PortfolioModel = PortfolioModel;