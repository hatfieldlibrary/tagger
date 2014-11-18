/**
 * Created by mspalti on 6/6/14.
 */

describe('Collections Browse', function(){

    describe('CollectionsCtrl', function() {

        var scope, ctrl, $httpBackend;
        beforeEach(function(){
            this.addMatchers({
                toEqualData: function(expected) {
                    return angular.equals(this.actual, expected);
                }
            });
        });
        beforeEach(module('collectionsApp'));
        beforeEach(module('collectionServices'));
        beforeEach(module('collectionAnimations'));
        beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('http://localhost:3000/rest/collection/bytag/1').
                respond([
                    {name: 'Beavers are Great'},
                    {name: 'Buffalo says Hi!'}
                ]);

            scope = $rootScope.$new();
            ctrl = $controller('CollectionsCtrl', {$scope: scope});
        }));

        it('should create "collections" model with 2 collections fetched from xhr', function() {
            expect(scope.collections).toEqualData([]);
            $httpBackend.flush();
            expect(scope.collections).toEqualData([
                {name: 'Beavers are Great'},
                {name: 'Buffalo says Hi!'}]);
        });
    });



});

describe('Sub-Page Collections', function() {


    describe('DspaceCollectionsCtrl', function() {

        var scope, ctrl, $httpBackend;
        beforeEach(function(){
            this.addMatchers({
                toEqualData: function(expected) {
                    return angular.equals(this.actual, expected);
                }
            });
        });
        beforeEach(module('collectionsApp'));
        beforeEach(module('collectionServices'));
        beforeEach(module('collectionAnimations'));
        beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('http://localhost:3000/rest/getDspaceCollections').
                respond([
                    {name: 'Department of Anthropology'},
                    {name: 'Department of Art History'}]);

            scope = $rootScope.$new();
            ctrl = $controller('DspaceCollectionsCtrl', {$scope: scope});
        }));
        it('should create DSpace collections model 2 collections fetched from xhr', function() {
            expect(scope.dspaceCollections).toEqualData([]);
            $httpBackend.flush();
            expect(scope.dspaceCollections).toEqualData([
                {name: 'Department of Anthropology'},
                {name: 'Department of Art History'}]);
        });

    });
});

