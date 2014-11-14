/**
 * Created by mspalti on 6/16/14.
 */
'use strict';



describe('DSpace Communities Browse', function() {

    var ptor;

    beforeEach(function() {
        ptor = protractor.getInstance();

    });


    it('should retrieve all DSpace communities', function() {
        browser.get('http://127.0.0.1:9000/#/community')
        ptor.findElements(protractor.By.repeater('collection in dspaceCollections')).then(function(collList) {

            expect(collList.length).toBe(37); // This is a promise

        });
    });

});
