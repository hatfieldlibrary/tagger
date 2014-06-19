'use strict';

//var request = require('request');

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
   require('load-grunt-tasks')(grunt);

    var files;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        app: 'app',
        dist: 'dist',
        public: 'public',
        express: {
            options: {
                port: process.env.PORT || 3000
            },
            dev: {
                options: {
                    script: 'app.js',
                    node_env: 'development',
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
                tasks: ['env:test', 'mochaTest']
            },
            js: {
                files: [
                    'public/js/*.js',
                ],
                options: {
                    livereload: true
                }
            },
            jade: {
                files: ['<%= app %>/views/**/*.jade'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                files: [

                    '<%= public %>/stylesheets/{,*//*}*.css',
                    '<%= public %>/javascripts/{,*//*}*.js'
                ],
                options: {
                    livereload: true
                }
            },
            express: {
                files: [
                    '<%= app %>/**/*.js',
                    'config/*.js',
                    'app.js'
                ],
                tasks: ['newer:jshint:server', 'express:dev', 'wait'],
                options: {
                    livereload: true,
                    nospawn: true //Without this option specified express won't be reloaded
                }
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
            server: '.tmp'
        }

    });

    //  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
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

    grunt.registerTask('test', function() {
        return grunt.task.run([
            'env:test',
            'mochaTest'
        ]);
    });

    grunt.registerTask('serve', function (target) {

        // development
        grunt.task.run([
            'clean:server',
            'express:dev',
            'open',
            'watch'
        ]);
    });


};
