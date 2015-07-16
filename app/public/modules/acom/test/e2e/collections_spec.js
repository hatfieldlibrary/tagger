
'use strict';

describe('Collections Browse', function() {

    var ptor;

    beforeEach(function() {
        ptor = protractor.getInstance();
    });


    it('should retrieve all collections in tagger with tag id 1 via REST', function() {
     browser.get('http://localhost:3000/rest/collection/bytag/1');

        ptor.findElements(protractor.get.('collection in collections')).then(function(collList) {

            expect(collList.length).toBe(1); // This is a promise

        });
    });

});




