// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require bootstrap
//= require_tree .

var Lyneage = (function() {
  return {
    callbacks: {
    },
    utils: {
      clone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
      }
    },
    get: function(pid) {
      if(pid && this.familyDict[pid]) {
        return this.familyDict[pid];
      } else {
        return this.familyDict;
      }
    },
    load: function(familyId, url) {
      var _this = this;

      _this.familyId = familyId;

      $.ajax(url)
        .success(function(data) {
          //document.lyneage.dataPoints = data;
          _this.familyDict = data;
          _this.init();
          parseNames($('.person-id'), data);
        });
    },
    init: function() {
      var _this = this,
          selectors = {
            familyTable: "#family",
            generateTree: ".tree-link",
            newPersonModal: "#add-modal",
            newChildLink: ".add-child"
          };

      $(selectors.familyTable)
        .on("click", selectors.generateTree, function(e) {
          e.preventDefault();

          var treeJson = buildTree(_this.familyDict, $(this).data('root'));

          drawTree(treeJson);
        })
        .on('click', selectors.newChildLink, function(e) {
          e.preventDefault();

          var $modal = $(selectors.newPersonModal),
              thisPid = $(this).data('pid'),
              thisPerson = _this.get(thisPid);

          $modal.find('.modal-header h3').text("Add a Child");

          $.get("/families/" + _this.familyId + "/people/new?parent=" + thisPid, function(data) {
            $modal.find('.modal-body').html(data);

            $modal.find('form').unbind('submit').bind('ajax:complete', function(e) {
              $modal.modal('hide');
            });

            var p2 = $modal.find('#parent_two');

            $.each(thisPerson.spouses, function(s) {
              var thatPid = this,
                  $option = $('<option></option>')
                    .val(thatPid)
                    .text(_this.get(thatPid).name);
              p2.append($option);
            });

            $modal.find('#parent_one').append(
              $("<option>")
                .val(thisPid)
                .text(thisPerson.name)
            ).change();

            $modal.modal();
          });
        }
      );

      $(selectors.newPersonModal).on("change", ".select-parents select", function(e) {
        e.preventDefault();

        var commadRelations = $(this).find(":selected").val()
              + "," + $(this).siblings().find(":selected").val();

        $('#person_parent').val(commadRelations);
      })
    }
  }
})();
