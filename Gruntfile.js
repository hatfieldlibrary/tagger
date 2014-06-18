'use strict';

//var request = require('request');

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
   require('load-grunt-tasks')(grunt);

   var reloadPort = 35732, files;
  //  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    //grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        app: 'app',
        dist: 'dist',
        express: {
            options: {
                port: process.env.PORT || 3000
            },
            dev: {
                options: {
                    script: 'app.js',
                    debug: true
                }
            },
            prod: {
                options: {
                    script: 'dist/app.js',
                    node_env: 'production'
                }
            },
            test: {
                options: {
                    script: 'app.js',
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
               // tasks: ['env:test', 'mochaTest']
            },
            js: {
                files: [
                    'public/js/*.js',
                    '<%= app %>/**/*.js',
                    'config/*.js'
                ],
                tasks: [ 'delayed-livereload']
            },
            jade: {
                files: ['<%= app %>/views/**/*.jade'],
                options: { livereload: reloadPort }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
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
        mochaTest: {
            options: {
                reporter: 'dot',
                ui: 'bdd',
                clearRequireCache: true
            },
            src: ['test/{,*/}*.js']
        },


        env: {
            test: {
                NODE_ENV: 'test'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-bower-install');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
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



    grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
        var done = this.async();
        setTimeout(function () {
            request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function(err, res) {
                var reloaded = !err && res.statusCode === 200;
                if (reloaded)
                    grunt.log.ok('Delayed live reload successful.');
                else
                    grunt.log.error('Unable to make a delayed live reload.');
                done(reloaded);
            });
        }, 500);
    });



    grunt.registerTask('test', function() {
        return grunt.task.run([
            'env:test',
            'express:test',
            'mochaTest'

        ]);
    });

    grunt.registerTask('serve', function (target) {
      //  if (target === 'dist') {
         //   return grunt.task.run(['build', 'express:prod', 'open', 'express-keepalive']);
      //  }

     //   if (target === 'debug') {
      //      return grunt.task.run([
             //   'clean:server',
             //   'bower-install',
             //   'concurrent:server',
             //   'autoprefixer',
             //   'concurrent:debug'
      //      ]);
      //  }

        grunt.task.run([
          //  'clean:server',
         //   'bower-install',
         //   'concurrent:server',
         //   'autoprefixer',
            'express:test',
            'open',
            'watch'
        ]);
    });
    /*
   // grunt.registerTask('watch', ['watch']);
   // grunt.registerTask('default', ['serve']);      */



};
