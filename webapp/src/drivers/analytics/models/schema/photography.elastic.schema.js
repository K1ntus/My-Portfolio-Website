const AbstractSchema = require('./aschema.elastic.schema')

class PhotographySchema extends AbstractSchema
{
    constructor(name) 
    {
        super(name);

        this.buildProperties()
        console.log(this.schema())
    }

    buildProperties()
    {
        this.buildFields_Commons()
        this.buildFields_Request()
        this.buildFields_Navigation()
    }

    buildFields_Commons()
    {
        this.addMappingElement("client.ip", "ip")
        this.addMappingElement("client.locale", "text")
        this.addMappingElement("client.browser", "text")
        this.addMappingElement("client.operation_system", "text")
    }

    buildFields_Request()
    {
        this.addMappingElement("client.request.date", "date")
    }

    buildFields_Navigation()
    {
        this.addMappingElement("client.url.origin", "text")
        this.addMappingElement("client.url.destination", "text")
    }
}
exports.PhotographySchema = PhotographySchema;