# Tagger Application

This nodejs application associates tags with collection information.  It provides a REST API that that allows clients to retrieve tag and collection information as JSON.
Two additional REST services are included: one for retrieving items from CONTENTdm and a second for retreving communities from DSpace.

### Development

When started in development mode, the Express service runs on the configured port (3000), a browser window is opened, and the watch service restarts as needed when files are updated.  This
application uses Jade templates. Automatically updating the browser window in the way that angularjs projects do -- with great convenience  -- does not appear possible without extended effort.
E.g.: attempts to use livereload with the Jade templates ran into a problem with conditional logic in the templates.  So, when coding you'll need to manually refresh the browser.

To start in development mode:

`grunt develop`

### Testing

The test environment runs a series of integration tests against mysql database.

To start in test mode:

`grunt test`