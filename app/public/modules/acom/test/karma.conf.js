'use strict';

module.exports = function(config){

    config.set({

        basePath : '../../../../',
        files : [
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/jquery/dist/jquery.js',
            'public/modules/acom/app/js/**/*.js',
            'public/modules/acom/test/unit/**/*.js'
        ],

        autoWatch : true,

        frameworks: ['jasmine'],

        browsers : ['Chrome'],

        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
        ],

        junitReporter : {
            outputFile: '<%= client %>/test_out/unit.xml',
            suite: 'unit'
        }

    });
};
