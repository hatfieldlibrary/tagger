'use strict';

//var request = require('request');

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
   require('load-grunt-tasks')(grunt);

   // var reloadPort = 35729, files;
  //  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    //grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
    //    develop: {
    //        server: {
    //            file: 'app.js'
    //        }
   //     },
        express: {
            options: {
                port: process.env.PORT || 9000
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
            }
        },
        watch: {
    //        options: {
    //            nospawn: true,
    //            livereload: reloadPort
    //        },
         //   server: {
         //       files: [
         //           'app.js',
         //           'config/routes/*.js'
         //       ],
         //       tasks: ['develop', 'delayed-livereload']
         //   },
         //   mochaTest: {
          //      files: ['test/{,*/}*.js'],
          //      tasks: ['env:test', 'mochaTest']
          //  },
          //  gruntfile: {
         //       files: ['Gruntfile.js']
         //   },
            js: {
                files: [
                    'public/js/*.js',
                    'app/**/*.js',
                    'config/*.js'
                ],
                tasks: [ 'delayed-livereload']
            },
            jade: {
                files: ['app/views/**/*.jade'],
                options: { livereload: reloadPort }
            }//,
         //   express: {
         //       files: [
         //           'app.js',
         //           'app/**/*.js'
         //       ],
         //       tasks: [ 'express:dev', 'wait']
             //   options: {
             //       livereload: true,
             //       nospawn: true //Without this option specified express won't be reloaded
              //  }
       //     }
        }//,
       // jshint: {
      //      options: {
       //         jshintrc: '.jshintrc',
       ////         reporter: require('jshint-stylish')
       //     },
       //     server: {
       //         options: {
       //             jshintrc: 'lib/.jshintrc'
      //          },
       //    //     src: [ 'lib/{,*/}*.js']
       //     },
        //    all: [
        //        '<%= yeoman.app %>/scripts/{,*/}*.js'
        //    ],
        //    test: {
        //        options: {
         //           jshintrc: 'test/client/.jshintrc'
        //        },
        //        src: ['test/client/spec/{,*/}*.js']
        //    }
       // }*/,
    //    mochaTest: {
   //         src: ['test/**/*.js']
   //     },


   //     env: {
   //         test: {
  //              NODE_ENV: 'test'
   //         }
   //     }
    });

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

   // grunt.registerTask('express', ['express','watch'])

    grunt.registerTask('test', function() {
        return grunt.task.run([
            'env:test',
            'watch',
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

        grunt.task.run(
          //  'clean:server',
         //   'bower-install',
         //   'concurrent:server',
         //   'autoprefixer',
            'express:dev'
          //  'open',
          //  'watch'
        );
    });
   // grunt.registerTask('watch', ['watch']);
   // grunt.registerTask('default', ['serve']);
};
