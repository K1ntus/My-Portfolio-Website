const Constants = require('../common/constants')
const CommonFunctions = require('../common/functions')
const ImageMetadata = require('./ImageMetadata.model');
const ExifReader = require('exifreader');
const fs = require('fs')

class ImageModel 
{
  constructor (image_path) {
      this._image_path = image_path;
      this._sharp_image_path = "";
      this._image_name = "";
      this._image_root_path = "";
      this._sub_collection = "";
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
      if (!this.isSharpImageGenerated())
      {
        console.log("Generating sharp image: " + this.getSharpImageFilePath() + "...")
        // this.generateSharpImage()
      }

      this._image_root_path = this._image_path.split('/views')[0] + "/views"
      this._sharp_image_path = this._image_root_path.split('/views')[1]
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
          console.error ("Not enough segments to split for collections")
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
      return this._sharp_image_path;
    }

    getSharpImageFilePath()
    {
      if (this._sharp_image_path === "")
      {
        this._sharp_image_path = this._image_path.replace(".jpg", "-sharp.jpg");
        console.log("new sharp image path: " + this._sharp_image_path)
      }

      return this._sharp_image_path
    }

    isSharpImageGenerated()
    {
      if (!this._image_path.toLowerCase().includes("sharp"))
      {
        if (fs.existsSync(this.getSharpImageFilePath()))
        {
          console.log(this._sharp_image_path + " exists.")
          return true;
        }

        console.log(this._sharp_image_path + " does not exist.")
      }
      else // Already a Sharp image
      {
        return true;
      }
      return false;
    }

    async generateSharpImage()
    {
      try
      {
        const sharp = require('sharp');
        const buf = await fs.promises.readFile(this._image_path);
        await sharp(buf)
            .resize(600, 400, {
              fit: 'contain',
              background: { r: 255, g: 255, b: 255, alpha: 1.0 }
            })
            .toFormat("jpeg", { mozjpeg: true})
            .toFile(this.getSharpImageFilePath())
            .catch(err =>{
              console.log("err: ",err);  
              console.log("For target file: " + this.getSharpImageFilePath())  
            });
        // fs.unlink(this.getSharpImageFilePath(), ()  => { })
      }
      catch (error)
      {
        console.log(error)
      }
    }

    get collection ()
    {
      return this.collection_name;
    }
}

exports.ImageModel = ImageModel;