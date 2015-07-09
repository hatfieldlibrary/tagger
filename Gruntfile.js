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
    app:    'app',
    config: 'config',
    client: 'app/public/modules/acom',
    dist:   'app/public/modules/acom/dist',
    public: 'app/public',

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
      runlocal: {
        options: {
          script:'server.js',
          node_env: 'runlocal',
          debug: true
        }
      },
      prod: {
        options: {
          script: 'server.js',
          node_env: 'production',
          debug: false
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
        url: 'http://localhost:<%= express.options.port %>/commons'
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
        files: '<%= public %>/scss/**/*.scss',
        tasks: ['sass']
      },
      module: {
        files: [
          // admin
          '<%= public %>/stylesheets/{,*//*}*.css',
          '<%= public %>/javascripts/{,*//*}*.js',
          // public view
          '<%= client %>/app/**/*.html',
          '<%= client %>/app/js/**/*.js',
          '<%= client %>/app/*.css',
          '<%= client %>/app/**/*.{jpg,gif,svg,jpeg,png}',
          // exclude bower components
          '!<%= client %>/app/bower_components/**'
        ],
        // tasks: ['newer:jshint','express:dev', 'wait'],
        options: {
          livereload: ReloadPort,
          nospawn: true //Without this option specified express won't be reloaded
        }
      },
      express: {
        files: [
          '!<%= client %>/**/*.js',
          '<%= app %>/**/*.js',
          'config/*.js',
          'server.js',

        ],
        tasks: ['newer:jshint', 'express:dev', 'wait'],
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
          '<%= config %>/js/**/*.js',
          '<%= client %>/app/js/**/*.js',
          './server.js'
        ]
      },
      test: {
        options: {
          jshintrc: '<%= client %>/test/.jshintrc'
        },
        src: ['<%= client %>/test/*.js']
      },
      client: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: [
          'app/controllers/*.js',
          'app/models/*.js',
          'config/*.js',
          '<%= client %>/app/js/*.js'
        ]
      }
    },

    htmlmin: {
      dist: {
        files: [{
          expand: true,
          src: '<%= client %>/app/**/*.html',
          dest: '<%= dist %>'
        }]
      }
    },

    clean: {
      server: '.tmp',
      dist: {
        src: ['<%= dist %>/*']
      }
    },

    copy: {
      // copy to the public ui dist directory
      client: {
        files: [{
          expand: true,
          cwd:'<%= client %>/app',
          src: ['js/*.js','extras/**','images/**','*.txt', '**/*.html', '!**/*.scss', '!bower_components/**'],
          dest: '<%= dist %>'
        } , {
          expand: true,
          flatten: true,
          cwd:'<%= client %>/app',
          src: ['bower_components/font-awesome/fonts/**'],
          dest: '<%= dist %>/css/fonts/',
          filter: 'isFile'
        }, {
          expand: true,
          flatten: true,
          cwd:'<%= client %>/app',
          src: ['bower_components/modernizr/modernizr.js' ],
          dest: '<%= dist %>/js/vendor',
          filter: 'isFile'
        }
        ]
      }
    },

    concat: {
      // These targets concat javascript libraries into the
      // public UI dist directory.
      libraries: {
        flatten: true,
        src:[
          '<%= app %>/bower_components/angular/angular.js',
          '<%= app %>/bower_components/angular-animate/angular-animate.js',
          '<%= app %>/bower_components/angular-resource/angular-resource.js',
          '<%= app %>/bower_components/angular-route/angular-route.js',
          '<%= app %>/bower_components/jquery/dist/jquery.js',
          '<%= app %>/bower_components/foundation/js/vendor/jquery.cookie.js',
          '<%= app %>/bower_components/jquery.placeholder/jquery.placeholder.js',
          '<%= app %>/bower_components/foundation/js/vendor/fastclick.js',
          '<%= app %>/bower_components/rem-unit-polyfill/js/rem.js'],
        dest: '<%= dist %>/js/vendor/libraries.js'
      },
      foundation: {
        flatten: true,
        src: [
          '<%= app %>/bower_components/foundation/js/foundation/foundation.js',
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
      // These targets contact the same javascript libraries
      // into the admin UI javascripts directory. This allows
      // backend and frontend dependencies to be decoupled, although this
      // probably isn't necessary given that we deploy the application under
      // a single Express server.
      serverlibs: {
        flatten: true,
        src:[
          '<%= app %>/bower_components/angular/angular.js',
          '<%= app %>/bower_components/angular-animate/angular-animate.js',
          '<%= app %>/bower_components/angular-resource/angular-resource.js',
          '<%= app %>/bower_components/angular-route/angular-route.js',
          '<%= app %>/bower_components/jquery/dist/jquery.js',
          '<%= app %>/bower_components/foundation/js/vendor/jquery.cookie.js',
          '<%= app %>/bower_components/jquery.placeholder/jquery.placeholder.js',
          '<%= app %>/bower_components/foundation/js/vendor/fastclick.js',
          '<%= app %>/bower_components/rem-unit-polyfill/js/rem.js'],
        dest: '<%= app %>/public/javascripts/vendor/libraries.js'
      },
      serverfoundation: {
        flatten: true,
        src: [
          '<%= app %>/bower_components/foundation/js/foundation/foundation.js',
          '<%= app %>/bower_components/foundation/js/foundation/foundation.accordian.js',
          '<%= app %>/bower_components/foundation/js/foundation/foundation.dropdown.js',
          '<%= app %>/bower_components/foundation/js/foundation/foundation.offcanvas.js',
          '<%= app %>/bower_components/foundation/js/foundation/foundation.tab.js',
          '<%= app %>/bower_components/foundation/js/foundation/foundation.topbar.js',
          '<%= app %>/bower_components/foundation/js/foundation/foundation.tooltip.js',
          '<%= app %>/bower_components/foundation/js/foundation/foundation.equalizer.js',
          '<%= app %>/bower_components/foundation/js/foundation/foundation.magellan.js'],
        dest: '<%= app %>/public/javascripts/vendor/foundation.js'
      },
      modernizr: {
        flatten: true,
        src:['<%= client %>/app/js/plugins/modernizr.optimized.js',
        ],
        dest: '<%= dist %>/js/plugins/modernizr.js'
      },
      css: {
        flatten: true,
        src: ['<%= client %>/app/css/*.css', '!*.min.css'],
        dest: '<%= dist %>/css/app.css'
      }
    },

    imagemin: {
      target: {
        files: [{
          expand: true,
          cwd: '<%= client %>/app/images/',
          src: ['**/*.{jpg,gif,svg,jpeg,png}'],
          dest: '<%= dist %>/images/'
        }]
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd:  '<%= dist %>/css',
        src: ['**/*.css','!*.min.css'],
        dest: '<%= dist %>/css',
        ext: '.min.css'
      }
    },

    uglify: {
      options: {
        preserveComments: 'some',
        mangle: false
      },
      client:
      {
        files: [{
          expand: true,
          cwd: '<%= dist %>/js/vendor',
          src: '*.js',
          ext: '.min.js',
          dest: '<%= dist %>/js/vendor'
        }]
      },
      server:{
        files: [{
          expand: true,
          cwd: '<%= app %>/public/javascripts/vendor',
          src: '*.js',
          ext: '.min.js',
          dest: '<%= app %>/public/javascripts/vendor'
        }]
      }
    },

    useminPrepare: {
      html: ['<%= client %>/app/index.html'],
      options: {
        dest: '<%= dist %>'
      }
    },

    usemin: {
      html: ['<%= dist %>/**/*.html', '!<%= app %>/bower_components/**'],
      css: ['<%= dist %>/css/**/*.css'],
      options: {
        dirs: ['<%= dist %>']
      }
    },

    bowerInstall: {
      target: {
        src: [
          '<%= client %>/app/index.html'
        ],
        exclude: [
          'jasmine',
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
        configFile: '<%= client %>/test/karma.conf.js'
      }
    },

    mocha: {
      all: {
        options: {
          //   reporter: 'spec',
          ui: 'bdd',
          slow: true,
          run: true
        }
      },

      src: ['<%= app %>/test/{,*/}*.js']
    },

    env: {
      test: {
        NODE_ENV: 'test'
      }
    },

    sass: {
      options: {
        sourceMap: true,
        includePaths: [
          '<%= public %>/scss/**/*.scss']
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: [{
          expand: true,
          cwd: '<%= public %>/scss',
          src: ['**/*.scss'],
          dest: '<%= client %>/app/css',
          ext: '.css'
        }]
      }
    },
    modernizr: {

      dist: {
        devFile: '<%= app %>/bower_components/modernizr/modernizr.js',
        outputFile: '<%= client %>/app/js/plugins/modernizr.optimized.js',
        extra: {
          shiv: true,
          printshiv: false,
          load: true,
          mq: false,
          cssclasses: true
        },
        extensibility: {
          addtest: false,
          prefixed: false,
          teststyles: false,
          testprops: false,
          testallprops: false,
          hasevents: false,
          prefixes: false,
          domprefixes: false
        },
        uglify: true,
        tests: [],
        parseFiles: true,
        files: {
          src: ['<%= client %>/app/js/**/*.js',
            '<%= client %>/app/css/**/*.css',
            '<%= public %>/sass/**/*.scss'
          ]
        },
        matchCommunityTests: false,
        customTests: []
      }
    }

  });

  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.config.requires('watch.js.files');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-bower-install');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-modernizr');
 // grunt.loadNpmTasks('grunt-mocha');
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
  grunt.registerTask('serverTest', function() {
     grunt.task.run([
      'env:test',
      'mocha'
    ]);
  });
  grunt.registerTask('test', ['karma']);
  grunt.registerTask('bower-install', ['bowerInstall']);
  grunt.registerTask('validate-js', ['jshint']);
  grunt.registerTask('compile-sass', ['sass']);
  grunt.registerTask('develop', function () {
    grunt.task.run([
      'clean:server',
      'compile-sass',
      'concat:serverlibs',
      'concat:serverfoundation',
      // Uncomment the following uglify task if you
      // want to test new javascript libs with admin
      // mode. It takes a while to complete, which
      // is why it is commented out here. The task
      // is included by default when you publish.
      // 'uglify:server',
      'express:dev',
      'bower-install',
      'open',
      'watch'
    ]);
  });
  grunt.registerTask('runlocal', function() {
    grunt.task.run([
      'clean:server',
      'express:runlocal',
      'open',
      'watch'
    ]);
  });
  grunt.registerTask('publish', [
    'compile-sass',
    'clean:dist',
    'validate-js',
    'modernizr:dist',
    'bower-install',
    'useminPrepare',
    'copy:client',
    'concat',
    'newer:imagemin',
    'cssmin',
    'uglify',
   // 'copy:server',
    'usemin']);

};
