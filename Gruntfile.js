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
    config: 'config',
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
        dest: '<%= dist %>/js/vendor/libraries.min.js'
      },
      foundation: {
        flatten: true,
        src: [
          '<%= client %>/app/bower_components/foundation/js/foundation/foundation.js',
          '<%= client %>/app/bower_components/foundation/js/foundation/foundation.accordian.js',
          '<%= client %>/app/bower_components/foundation/js/foundation/foundation.dropdown.js',
          '<%= client %>/app/bower_components/foundation/js/foundation/foundation.offcanvas.js',
          '<%= client %>/app/bower_components/foundation/js/foundation/foundation.tab.js',
          '<%= client %>/app/bower_components/foundation/js/foundation/foundation.topbar.js',
          '<%= client %>/app/bower_components/foundation/js/foundation/foundation.tooltip.js',
          '<%= client %>/app/bower_components/foundation/js/foundation/foundation.equalizer.js',
          '<%= client %>/app/bower_components/foundation/js/foundation/foundation.magellan.js'],
        dest: '<%= dist %>/js/vendor/foundation.min.js'
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
        src: ['*.css','!*.min.css'],
        dest: '<%= dist %>/css',
        ext: '.min.css'
      }
    },

    uglify: {
      options: {
        preserveComments: 'some',
        mangle: false
      },
      target:
      {
        files: [{
          expand: true,
          cwd: '<%= dist %>/js/vendor',
          src: '*.min.js'
          //dest: '<%= dist %>/js/vendor'
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
          'public/modules/acom/app/index.html'
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
        configFile: '<%= client %>/test/karma.conf.js'
      }
    },
    sass: {
      options: {
        includePaths: [
          '<%= client %>/app/bower_components/foundation/scss',
          '<%= client %>/app/scss/**/*.scss']
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          '<%= client %>/app/css/app.css': '<%= client %>/app/scss/app.scss'
        }
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
  grunt.loadNpmTasks('grunt-newer');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);
  grunt.loadNpmTasks('grunt-karma');


  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');
    var done = this.async();
    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 500);
  });

  grunt.registerTask('serverTest', function() {
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
      'compile-sass',
      'bower-install',
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
  grunt.registerTask('bower-install', ['bowerInstall']);
  grunt.registerTask('validate-js', ['jshint']);
  grunt.registerTask('test', ['karma']);
  grunt.registerTask('compile-sass', ['sass']);
  grunt.registerTask('publish', ['compile-sass', 'clean:dist', 'validate-js', 'useminPrepare', 'copy:client', 'concat', 'newer:imagemin', 'cssmin', 'uglify', 'usemin']);


};
