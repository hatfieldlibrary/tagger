jQuery(function() {
  var availableTags;
  var availableTypes;

  getTags(function(data) {
    availableTags = data;
    jQuery( "#tagNames" ).autocomplete(
      {
        source: availableTags,
        select: function (event, ui) {
          jQuery("#tagNames").val(ui.item.label);
          idValue = ui.item.id;
        }
      }
    );
  });

  getTypes(
    function(data) {
      availableTypes = data;
      jQuery( "#typeNames" ).autocomplete(
        {source: availableTypes,
          select: function (event, ui) {
            jQuery("#typeNames").val(ui.item.label);
            idValue = ui.item.id;
          }
        }
      );
    }
  );
});

jQuery(document).ready(
  function() {
    jQuery("#tagForm").submit( function (event) {
      if (idValue === undefined) {
        event.preventDefault();
      } else {
        jQuery('#tagId').val(idValue);
      }
    });
    jQuery("#typeForm").submit(function (event) {
      if (idValue === undefined) {
        event.preventDefault();
      } else {
        jQuery('#typeId').val(idValue);
      }
    });
  });
