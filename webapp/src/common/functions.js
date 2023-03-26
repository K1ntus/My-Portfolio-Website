function capitalizeFirstLetter (string) {
    if (string != undefined)
    {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }
    else
    {
        console.error("undefined string to capitalize")
    }
}

function loadImageSynchronously(image_path)
{
  if (image_path != undefined)
  {
    const fs = require('fs')
    const path = require('path')
    const image = path.join(image_path)
    const file = fs.readFileSync(image)

    return file;
  }
  else
  {
    console.error("Unable to load file")
  }

  return undefined;
}

function getListOfFilesInSubdirectory(directory_path)
{
    var _getAllFilesFromFolder = function(dir) {

        var filesystem = require("fs");
        var results = [];
    
        filesystem.readdirSync(dir).forEach(function(file) {
    
            file = dir+'/'+file;
            var stat = filesystem.statSync(file);
    
            if (stat && stat.isDirectory()) {
                results = results.concat(_getAllFilesFromFolder(file))
            } else results.push(file);
    
        });
    
        return results;
    
    };

    return _getAllFilesFromFolder(directory_path)
}

module.exports = { capitalizeFirstLetter, loadImageSynchronously, getListOfFilesInSubdirectory }