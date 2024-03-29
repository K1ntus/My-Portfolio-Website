class ImageMetadata 
{
    constructor (title, description, shopping_link, aperture, shutter_speed, focal_length, exposure_time, iso, original_date, camera_model, lens_model)
    {
        this._title = title;
        this._description = description;
        this._shopping_link = shopping_link;
        this._aperture = aperture;
        this._shutter_speed = shutter_speed;
        this._focal_length = focal_length;
        this._exposure_time = exposure_time;
        this._iso = iso;
        this._original_date = original_date;
        this._camera_model = camera_model;
        this._lens_model = lens_model;
    }
}

exports.ImageMetadata = ImageMetadata;