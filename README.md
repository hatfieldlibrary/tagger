# AngularJS - Express Collection Tagger

The Express application associates tags with collection information.  It includes a REST API for retrieving tag and collection information via JSON.
Two additional REST services are included: one for retrieving items from CONTENTdm and a second for retreiving communities from DSpace.

The public AngularJS module is the Academic Commons web site.


### Development

To get started with development, clone the project into your working directory. For example:

    git init
    git pull https://mspalti@stash.app.willamette.edu/scm/ac/backend.git

Next, install the dependencies:

    npm install

The tagger application itself currently does not use bower for dependency management.  The public Academic Commons module does use bower.  So you will next need to run:

    bower install

Finally, the application requires mysql.  When in development, you need to install mysql on your machine and create empty databases (Acomtags is the production database, so you may not require it for your local development work.):

    acomtags_development
    acomtags_test
    acomtags

Assign mysql permissions to the databases. 

The application uses Sequelize as the ORM.  Database tables are defined in the application models package (Express MVC). To access your mysql databases, add the mysql user name and password the the project configuration.
 To do this, open `config/environment.js` and edit the `user` and `password` for each of the databases. Do this only for development, runlocal, and test configurations if these are what you will be using.  Example:

        development: {
           root: rootPath,
           app: {
             name: 'acomtags'
           },
           port: 3000,
           db: 'acomtags_development',
           user: <username>',
           password: '<password>',
           uid: 'mspalti',
           gid: 'staff',
           host: 'localhost',
           sync: { force: false },
           convert: '/usr/local/bin/convert',
           identify: '/usr/local/bin/identify',
           taggerImageDir: '/usr/local/taggerImages',
           modulePath: '/public/modules/acom/app',
           googleClientId: '<GOOGLE CLIENT ID>',
           googleClientSecret: '<GOOGLE CLIENT SECRET',
           googleCallback: 'http://localhost:3000/auth/google/callback',
           redis: {
             host: "127.0.0.1",
             port: 3006
           },
           nodeEnv: env
         },


You're now ready to start the application. When you first start the application in development mode, Sequelize will create tables in the `acomtags_development` database.

The Express service runs on the port configured in `config/environment.js` (3000).  A browser window is opened on start and the watch service restarts as needed when files are updated.  

The Tagger application uses Jade templates. Unfortunately, updating the browser window automatically with file edits doesn't appear possible without additional work.
My attempt to use livereload with the Jade templates ran into a problem with conditional logic in the templates.  So, when coding you'll need to manually refresh the browser.

To start development mode:

    grunt develop


### Testing

The test environment runs a series of integration tests against the `acomtags_test` database. Before each test run, Sequelize will drop the existing tables and create new ones.

To start test mode:

    grunt test

### Runlocal

The AngularJS application is compiled using `grunt publish` and copied to the `dist` directory inside the module.  You can preview the result using the runlocal task:

    grunt runlocal

### Production

To run on the production server, be sure that nodejs and the required node modules are installed.

First, make sure nodejs is installed on the server.  It can be installed in a number of ways.  If using RHEL package manager, you can try this:

    sudo yum install nodejs npm --enablerepo=epel

Currently, we are using the forever CLI to launch and keep the Express server running.  Install forever globally as follows:

    sudo npm install forever -g
    
From this point, how you proceed will depend on the production environment and whether you are copying the project from your local machine or cloning from git and building from scratch.  

The following assumes that you have built and tested the application already. It also assumes that you have created an init.d script that launches forever and added this to your system runlevels.

1. Copy the project to a location on the server. If you know what you are doing, you can omit unnecessary development files.
2. If you have not done so already, create a `node` user. Set the owner and group for all files (including .* files) to the node user.  
3. Start `forever` via the init.d script (e.g. /sbin/service script start). If you are updating an existing installation, you should stop `forever` before replacing code and start again after the changes are made.

Be sure that the init.d startup script sets the NODE_ENV value to 'production.' Example: `NODE_ENV=production $DAEMON $DAEMONOPTS start $NODEAPP`

Set the etails of the production environment, including database access credentials, paths, and Google OAUTH2 credentials in config/environment.js.  


### Configuration

Configuration file: config/environment.js

* root: path set by module
* port: Express port
* db: database name
* user: database user
* password: database password
* uid: Express system user
* gid: Express system group
* mysql host: host name (e.g. libdb.willamette.edu)
* sync: Sequelize database initialization setting
* convert: location of ImageMagick convert library
* identify: location of ImageMagick identify library
* taggerImageDir: path to tagger images
* modulePath: path to the AngularJS module directory (app or dist)
* googleClientId: the Google ID for this application (used by OAUTH2)
* googleClientSecrect: Google secret (used by OAUTH2)
* redis: sesion cache settings (experimental)
* nodeEnv: current node environment (startup setting or default)


