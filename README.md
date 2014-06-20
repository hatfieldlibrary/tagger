# Tagger Application

This nodejs application associates tags with collection information.  It provides a REST API that that allows clients to retrieve tag and collection information as JSON.
Currently, two additional REST services are included: one for retrieving items from CONTENTdm and a second for retreving communities from DSpace.


### Development

To get started with development, first clone the project into your working directory. For example:

`git init
git pull https://mspalti@stash.app.willamette.edu/scm/ac/backend.git`

Next, install the dependencies:

`npm install`

The application requires mysql.  When in development, you need to install mysql on your machine and create the following empty databases:

`acomtags_development`
`acomtags_test`
`acomtags`

Assign permissions to these databases. Since this is your own test mysql instance, you might want use a shortcut by assigning all privileges on all databases to yourself.

The application uses Sequelize as the ORM.  Database tables are defined in the application as models (think Express MVC). When you first start the application, Sequelize will create
 tables for you in the database. To access your development mysql databases, you need to provide Sequelize with the new user name and password you created for the local mysql database.
 To do this, open `app/models/index.js` and edit the Sequelize constructor:

` sequelize = new Sequelize(config.db, 'yourmysqlusername', 'yourmysqlpassword')`

You're now ready to start the application.

When started in development mode, the Express service runs on the port configured in `config/environment.js` (3000).  A browser window is opened on start and the watch service restarts things as needed when files are updated.  This
application uses Jade templates. Updating the browser window automatically with file edits doesn't appear possible without additional effort.
E.g.: my attempt to use livereload with the Jade templates ran into a problem with conditional logic in the templates.  So, when coding you'll need to manually refresh the browser.

To start development mode:

`grunt develop`


### Testing

The test environment runs a series of integration tests against mysql database.  It uses the `acomtags_test` database.  Before each test run, Sequelize will drop the existing tables and create new ones.

To start test mode:

`grunt test`