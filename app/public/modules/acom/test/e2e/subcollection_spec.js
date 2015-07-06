/**
 * Created by mspalti on 6/16/14.
 */

describe('Sub-Page Collections by subject terms and by tag', function() {

   var ptor;

    beforeEach(function() {
        ptor = protractor.getInstance();

    });

    // retrieve digital sub-collections by tag
    it('should retrieve all collections in tagger with tag id 2', function() {
        browser.get('http://127.0.0.1:9000/#/archivesCollect/political+papers/local/2');
        ptor.findElements(By.repeater('collection in subCollections')).then(function(collList) {

            expect(collList.length).toBe(2); // This is a promise

        });
    });


    // retrieve EAD files by subject term
    it('should retrieve all ead file list for political papers', function() {
        browser.get('http://127.0.0.1:9000/#/archivesCollect/political+papers/local/2');
        ptor.findElements(By.repeater('ead in eads')).then(function(collList) {

            expect(collList.length).toBe(7); // This is a promise

        });
    });
});

