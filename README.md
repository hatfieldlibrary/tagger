# Tagger Application

This nodejs application is designed to associate tags with collection information.  It includes a REST API that that allows client applications to retrieve tag and collection information as JSON.
Two additional REST services are included: one for retrieving items from CONTENTdm and a second for retreving communities from DSpace.

### Development

The development environment starts the application Express service and opens a browser window to the server and port.

grunt serve

### Testing

The test environment runs a series of integration tests against mysql database.

grunt test