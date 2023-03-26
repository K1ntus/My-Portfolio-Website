const Image = require('./Image.model');
const Constants = require('../common/constants')
const CommonFunctions = require('../common/functions')

class CollectionModel
{
  constructor (collection_name)
  {
    this._collection_name = CommonFunctions.capitalizeFirstLetter(collection_name).trim()
    this._images = [];
    
    this.buildImagesOfCollection(__dirname + '\\..\\..' + Constants.COLLECTION_ROOT_PATH)
  }

  getCollectionName()
  {
    return this._collection_name
  }

  getCollectionImages()
  {
    return this._images
  }

  //  ***********************

  buildImagesOfCollection(filepath)
  {
    let image_filepaths = this.getImagesFilePathList(filepath);
    image_filepaths.forEach(path => {
      path = path.replaceAll('\\', '/')
      this._images.push( new Image.ImageModel(path))
    });
  }

  getImagesFilePathList(filepath)
  {
    return CommonFunctions.getListOfFilesInSubdirectory(filepath + this._collection_name)
  }


  
  buildJson()
  {
    let result = JSON.stringify(this, null, 2)
    // console.log(result)
    return result
  }
}

exports.CollectionModel = CollectionModel;