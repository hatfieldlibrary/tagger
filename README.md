# Tagger Application

This nodejs application is designed to associate tags with collection information.  It includes a REST API that that allows client applications to retrieve tag and collection information as JSON.
Two additional REST services are included: one for retrieving items from CONTENTdm and a second for retreving communities from DSpace.

### Development

When started in development mode, the Express service runs on the configured port (3000), a browser window is opened, and the watch service restarts as needed when files are updated.  This
application uses Jade templates and automatically updated the browser window in the way that angularjs projects do with great convenience.  Attempts to use livereload with the Jade templates ran into
problems with conditional logic in the templates.  So, when coding you need to manually refresh the browser.

To start in development mode:

`grunt serve`

### Testing

The test environment runs a series of integration tests against mysql database.

To start in test mode:

`grunt test`