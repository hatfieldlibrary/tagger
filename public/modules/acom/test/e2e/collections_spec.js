
'use strict';

describe('Collections Browse', function() {

    var ptor;

    beforeEach(function() {
        ptor = protractor.getInstance();
    });


    it('should retrieve all collections in tagger with tag id 1', function() {
        browser.get('http://127.0.0.1:9000/#/collections/1');
        ptor.findElements(protractor.By.repeater('collection in collections')).then(function(collList) {

            expect(collList.length).toBe(4); // This is a promise

        });
    });

});




