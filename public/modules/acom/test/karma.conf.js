'use strict';

module.exports = function(config){

    config.set({

        basePath : '../../../',
        files : [
            'modules/acom/app/bower_components/angular/angular.js',
            'modules/acom/app/bower_components/angular-route/angular-route.js',
            'modules/acom/app/bower_components/angular-animate/angular-animate.js',
            'modules/acom/app/bower_components/angular-resource/angular-resource.js',
            'modules/acom/app/bower_components/angular-mocks/angular-mocks.js',
            'modules/acom/app/bower_components/jquery/dist/jquery.js',
            'modules/acom/app/js/**/*.js',
            'modules/acom/test/unit/**/*.js'
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
