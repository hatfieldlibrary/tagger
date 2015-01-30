# AngularJS - Express Collection Tagger

The Express application associates tags with collection information.  It includes a REST API for retrieving tag and collection information via JSON.
Two additional REST services are included: one for retrieving items from CONTENTdm and a second for retreiving communities from DSpace.

The public AngularJS module is the Academic Commons web site.


### Setup

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

The application uses Sequelize as the ORM.  Database tables are defined in the application models package (Express MVC). To access your mysql databases, set the mysql user name and password the the project configuration.
 To do this, open `config/environment.js` and edit the `user` and `password` for each of the databases. Pay attention to the different environment configurations since these are associated with different databases.  
 
 The Express server will run setuid and setgid on startup.  On the production server, both values should be set to `node`.  When working on your own development machine, set these values to match your own uid and gid.
  
 Here's an example development configuration:

        development: {
           root: rootPath,
           app: {
             name: 'acomtags'
           },
           port: 3000,
           mysql: {
             db: 'acomtags_development',
             user: 'mspalti',
             password: 'coffee',
             uid: 'mspalti',
             gid: 'staff',
             host: 'localhost',
             port: '3306',
             sync: {force: false}
           },
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


### Development
You're now ready to start the application. When you first start the application in development mode, Sequelize will create tables in the `acomtags_development` database.

The Express service runs on the port configured in `config/environment.js` (3000).  A browser window is opened on start and the watch service restarts the Express server and compiles sass whenever files are updated.  

The Tagger application uses Jade templates. 

Unfortunately, the grunt `watch` task doesn't update the browser window automatically with file edits.  This might be possible with additional work.
My attempt to use livereload with the Jade templates ran into a problem with the conditional logic in the templates.  So, when coding you'll need to manually refresh the browser.

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

First, make sure nodejs is installed on the server.  It can be installed in a number of ways.  It's wise to use the identical nodejs version that you are using in your development environment.

You will need to decide how to manage the application runtime on your server. Currently, we are using the `forever` CLI to launch and keep the Express application online. Install `forever` globally as follows:

    sudo npm install forever -g
    
Create an init.d script that launches the application using `forever` as well as a second init.d script that starts the `redis` session store. Add these two startup tasks to your system runlevels. 

Create a `node` user on the system. Next, verify that your init.d startup script sets the `NODE_ENV` value to 'production.' Example: `NODE_ENV=production $DAEMON $DAEMONOPTS start $NODEAPP`. 

The following deployment assumes that you have previously built and tested the application on your development machine. 

1. Copy the project to a location on the server. If you know what you are doing, you can omit unnecessary development files.
2. Edit the details of the production environment in `config/environment.js`, including database access credentials, paths, and Google OAUTH2 credentials. 
3. Set the owner and group for project all files (including .* files) to the `node` user.  
4. Start `forever` via the init.d script (e.g. /sbin/service <script name> start). If you are updating an existing installation, you should stop `forever` before replacing code and start again after the changes are made.

## Configuration Params

Configuration file: config/environment.js

- root: path set by module
- port: Express port
- db: database name
- user: database user
- password: database password
- uid: Express system user
- gid: Express system group
- mysql host: host name (e.g. libdb.willamette.edu)
- sync: Sequelize database initialization setting
- convert: location of ImageMagick convert library
- identify: location of ImageMagick identify library
- taggerImageDir: path to tagger images
- modulePath: path to the AngularJS module directory (app or dist)
- googleClientId: the Google ID for this application (used by OAUTH2)
- googleClientSecrect: Google secret (used by OAUTH2)
- redis: sesion cache settings (experimental)
- nodeEnv: current node environment (startup setting or default)


