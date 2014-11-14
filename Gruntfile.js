'use strict';


module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // define reload port here to avoid conflict with
  // client applications
  var ReloadPort = 35642, files;

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    app: 'app',
    client: 'public/modules/acom',
    dist: 'public/modules/acom/dist',
    public: 'public',
    express: {
      options: {
        port: process.env.PORT || 3000
      },
      dev: {
        options: {
          script: 'server.js',
          node_env: 'development',
          debug: true
        }
      },
      prod: {
        options: {
          script: 'server.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'server.js',
          node_env: 'test',
          debug: true
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },
    watch: {
      mochaTest: {
        files: ['test/*.js'],
        tasks: ['env:test', 'mochaTest']
      },
      js: {
        files: [
          'public/js/*.js',
        ],
        options: {
          livereload: ReloadPort
        }
      },
      jade: {
        files: ['<%= app %>/views/**/*.jade'],
        options: {
          livereload: ReloadPort
        }
      },
      grunt: {
        files: ['Gruntfile.js'],
        tasks: ['sass']
      },
      sass: {
        files: '<%= client %>/app/scss/**/*.scss',
        tasks: ['sass']
      },
      livereload: {
        files: [
          '<%= public %>/stylesheets/{,*//*}*.css',
          '<%= public %>/javascripts/{,*//*}*.js',
          '<%= client %>/app/**/*.html',
          '!<%= client %>/app/bower_components/**',
          '<%= client %>/app/js/**/*.js',
          '<%= client %>/app/css/**/*.css',
          '<%= client %>/app/images/**/*.{jpg,gif,svg,jpeg,png}'
        ],
        options: {
          livereload: ReloadPort
        }
      },
      express: {
        files: [
          '<%= app %>/**/*.js',
          'config/*.js',
          'server.js'
        ],
        tasks: ['newer:jshint:server', 'express:dev', 'wait'],
        options: {
          livereload: ReloadPort,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }

    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        all: [
          'Gruntfile.js',
          '<%= app %>/js/**/*.js',
          '<%= client %>/js/**/*.js'
        ]
      },
      server: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: [ '<%= app %>/*.js']
      },

      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/*.js']
      }
    },
    htmlmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp',
          src: '*.html',
          dest: '<%= dist %>'
        }]
      }
    },
    mochaTest: {
      options: {
        reporter: 'spec',
        ui: 'bdd',
        slow: true
      },
      src: ['test/{,*/}*.js']
    },
    env: {
      test: {
        NODE_ENV: 'test'
      }
    } ,
    clean: {
      server: '.tmp',
      dist: {
        src: ['<%= dist %>/*']
      }
    },
    copy: {
      client: {
        files: [{
          expand: true,
          cwd:'<%= client %>/app',
          src: ['js/**','images/**','*.txt', '**/*.html', '!**/*.scss', '!bower_components/**'],
          dest: '<%= dist %>'
        } , {
          expand: true,
          cwd:'<%= client %>/app',
          flatten: true,
          src: ['bower_components/font-awesome/fonts/**'],
          dest: '<%= dist %>/fonts/',
          filter: 'isFile'
        }, {
          expand: true,
          flatten: true,
          cwd:'<%= client %>/app',
          src: ['bower_components/modernizr/modernizr.js' ],
          dest: '<%= dist %>/js/vendor',
          filter: 'isFile'

        } ]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= app %>',
          src: ['**/*.js'],
          dest: '<%= dist %>/server'
        }]
      },
      config: {
        files: [{
          expand: true,
          cwd: 'config',
          src: ['**/*.js'],
          dest: '<%= dist %>/server'
        }]
      },
      public: {
        files: [{
          expand: true,
          cwd: 'public',
          src: ['**/*'],
          dest: '<%= dist %>/server'
        }]
      },
      main: {
        files: [{
          src: ['server.js'],
          dest: '<%= dist %>/server'
        }]
      },
      node: {
        files: [{
          expand: true,
          cwd: 'node_modules',
          src: ['*'],
          dest: '<%= dist %>/server'
        }]
      }
    }, concat: {
      libraries: {
        flatten: true,
        src:[
          '<%= client %>/app/bower_components/angular/angular.js',
          '<%= client %>/app/bower_components/angular-animate/angular-animate.js',
          '<%= client %>/app/bower_components/angular-resource/angular-resource.js',
          '<%= client %>/app/bower_components/angular-route/angular-route.js',
          '<%= client %>/app/bower_components/jquery/dist/jquery.js',
          '<%= client %>/app/bower_components/foundation/js/vendor/jquery.cookie.js',
          '<%= client %>/app/bower_components/jquery.placeholder/jquery.placeholder.js',
          '<%= client %>/app/bower_components/foundation/js/vendor/fastclick.js',
          '<%= client %>/app/bower_components/rem-unit-polyfill/js/rem.js',
          '<%= client %>/app/bower_components/slick-carousel/slick/slick.js'],
        dest: '<%= dist %>/js/vendor/libraries.js'
      },
      foundation: {
        flatten: true,
        src: [ '<%= app %>/bower_components/foundation/js/foundation/foundation.js',
          '<%= app %>/bower_components/foundation/js/foundation/foundation.accordian.js',
          '<%= app %>/bower_components/foundation/js/foundation/foundation.dropdown.js',
          '<%= app %>/bower_components/foundation/js/foundation/foundation.offcanvas.js',
          '<%= app %>/bower_components/foundation/js/foundation/foundation.tab.js',
          '<%= app %>/bower_components/foundation/js/foundation/foundation.topbar.js',
          '<%= app %>/bower_components/foundation/js/foundation/foundation.tooltip.js',
          '<%= app %>/bower_components/foundation/js/foundation/foundation.equalizer.js',
          '<%= app %>/bower_components/foundation/js/foundation/foundation.magellan.js'],
        dest: '<%= dist %>/js/vendor/foundation.js'
      },
      css: {
        flatten: true,
        src: ['<%= app %>/css/*.css', '!*.min.css'],
        dest: '<%= dist %>/css/app.css'
      }
    },

    bowerInstall: {
      target: {
        src: [
          '<%= client %>app/**/*.html'
        ],
        exclude: [
          'modernizr',
          'font-awesome',
          'jquery-placeholder',
          'jquery.cookie',
          'foundation'
        ]
      }
    },
    karma: {
      unit: {
        configFile: '<%= client %>test/karma.conf.js'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');
    var done = this.async();
    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 500);
  });

  grunt.registerTask('test', function() {
    return grunt.task.run([
      'env:test',
      'mochaTest'
    ]);
  });

  grunt.registerTask('develop', function () {

    grunt.task.run([
      'clean:server',
      'express:dev',
      'open',
      'watch'
    ]);
  });


};
