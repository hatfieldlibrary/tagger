'use strict';

module.exports = function(config){
    config.set({

        basePath : '../../../',
        client: 'public/modules/acom',
        files : [
            '<%= client %>/app/bower_components/angular/angular.js',
            '<%= client %>/app/bower_components/angular-route/angular-route.js',
            '<%= client %>/app/bower_components/angular-animate/angular-animate.js',
            '<%= client %>/app/bower_components/angular-resource/angular-resource.js',
            '<%= client %>/app/bower_components/angular-mocks/angular-mocks.js',
            '<%= client %>/app/bower_components/jquery/dist/jquery.js',
            '<%= client %>/app/js/**/*.js',
            '<%= client %>/test/unit/**/*.js'
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
