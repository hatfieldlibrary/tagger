/**
 * Created by mspalti on 6/5/14.
 */

function getTags(tagCallback) {

    $.ajax({
        url: "/rest/taglist"
    }).success(function(data) {

        tagCallback(data)
    });

}


