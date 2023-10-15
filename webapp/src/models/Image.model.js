const Constants = require('../common/constants')
const CommonFunctions = require('../common/functions')
const ImageMetadata = require('./ImageMetadata.model');
const ExifReader = require('exifreader');

class ImageModel 
{
    constructor (image_path) {
      this._image_path = image_path
      this._image_name = ""
      this._sub_collection = ""
      // this._raw_metadata = {};
      this._image_metadata = {};

      this.buildImageMetadata()
      this.getSubCollectionWithImagePath()
      this.getImageNameWithImagePath()
      this.buildImageAssetLink()

      // this.buildJson()
    }

    buildImageAssetLink()
    {
      this._image_path = this._image_path.split('/views')[1]

    }

    readMetadataValue(metadata, field)
    {
      if (typeof metadata === 'undefined')
      {
        console.error("metadata undefined for ", this._image_name, " at path ", this._image_path)
        return "undefined"
      }
      
      if (!(field in metadata))
      {
        console.error(field, "is not in ", this._image_name)
        return "undefined"
      }
      return metadata[field].description
    
    }

    buildImageMetadata()
    {
      let file = CommonFunctions.loadImageSynchronously(this._image_path);
      if (typeof file != 'undefined')
      {
        let metadata = ExifReader.load(file);
        if (typeof metadata != 'undefined')
        {
          const aperture = this.readMetadataValue(metadata, 'ApertureValue');
          const shutter_speed = this.readMetadataValue(metadata, 'ShutterSpeedValue');
          const focal_length = this.readMetadataValue(metadata, 'FocalLength');
          const exposure_time = this.readMetadataValue(metadata, 'ExposureTime');
          const iso = this.readMetadataValue(metadata, 'ISOSpeedRatings');
          const date = this.readMetadataValue(metadata, 'DateTimeOriginal');
          const model = this.readMetadataValue(metadata, 'Model');
          const lens = this.readMetadataValue(metadata, 'LensModel');

          const title = "dummy title";
          const description = "dummy description";
          const shopping_link = "no link";

          this._image_metadata = new ImageMetadata.ImageMetadata(title, description, shopping_link, aperture, shutter_speed, focal_length, exposure_time, iso, date, model, lens);
        }
        else
        {
          console.error("Metadata is invalid for image: ", this.image_name)
        }
      }
      else
      {
        console.error("Undefined file loaded for path: " << this._image_path)
      }
    }

    getSubCollectionWithImagePath()
    {
      let image_collection = this._image_path.split(Constants.SEPARATOR);
      if (typeof image_collection != 'undefined')
      {
        if (image_collection.length > 1)
        {
          image_collection = image_collection[image_collection.length-2]
          this._sub_collection = CommonFunctions.capitalizeFirstLetter(image_collection).trim()
        }
        else
        {
          console.error ("Not enought segments to split for collections")
          image_collection = image_collection[image_collection.length-1]
          this._sub_collection = CommonFunctions.capitalizeFirstLetter(image_collection).trim()
        }
      }
      else
      {
        console.error("Unable to operate undefined string")
        this._sub_collection = "Invalid"
      }
    }

    getImageNameWithImagePath()
    {
      // let path = this._image_path.substring(0, Math.max(this._image_path.lastIndexOf("/"), this._image_path.lastIndexOf("\\"))); 
      let image_name = this._image_path.split(Constants.SEPARATOR);
      if (typeof image_name != 'undefined')
      {
        image_name = image_name[image_name.length-1]
        image_name = image_name.split('.')
        image_name = image_name[0]
        
        this._image_name = CommonFunctions.capitalizeFirstLetter(image_name)
      }
      else
      {
        console.error("Unable to operate undefined string")
        this._image_name = "Invalid"
      }
    }
  
    buildJson()
    {
      console.log(JSON.stringify(this, null, 2))
    }
    // *******************

    printImageInformations()
    {
      console.log("File Path: ", this._image_path)
      console.log("File Name: ", this._image_name)
      console.log(this._image_metadata)
    }
    // *******************
  
    get json ()
    {
      
    }
    get path ()
    {
      return this._image_path;
    }
    get collection ()
    {
      return this.collection_name;
    }
}

exports.ImageModel = ImageModel;