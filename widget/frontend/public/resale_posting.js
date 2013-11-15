var resale_posting = (function($, window, undefined){

    var init = function (config) {
      $(config.images).each(function(){
          new Image().src = this;
      });
      create();
      posting_popups();
    };
    
    var create = function() {
      $(document).ready(function() {
        $.mask.placeholder = "";
        $("#account-number").mask("?9999999999999999");
        $("#routing-number").mask("?9999999999999999");
        $("#input-ccnum").mask("?9999999999999999");
        $("#input-phone").mask("(999)-999-9999");
        $("#input-zip").mask("99999");

        $("#price_input").focus(function() {
          if( $(this).val() == "$0.00" ) {
            $(this).val("$");
          }
        }).blur(function() {
          if( $(this).val() == "" ) {
            $(this).val("$0.00");
          }
        }).autoNumeric('init', {aSign: '$', vMax: '999999.99', lZero: 'deny', aForm: false});
      });
    };

    var posting_popups =function(){
        $(function(){
            var removeListingError = function(id) {
                $(".lightbox-lid h3, .lightbox-container div", $(id)).hide();
                $(".lightbox-container h3", $(id)).html($(id).attr('data-error-info')).show();
            };
            $.each($("a[id^=remove-link]"), function(index, item){
                var popup_id = $(item).attr("href");
                var item_index = index + 1;
                var removeLightbox = new Popup (popup_id.replace("#", ""), {
                    lightbox: { opacity: 0.6 }
                });
                $(item).click(function() {
                    var that = this;
                    removeLightbox.show({
                        anchor_id: document.body,
                        popup_align: {
                            x: "center",
                            y: "center"
                        }
                    });
                    $("#remove-close" + item_index).focus();
                    return false;
                });
                $(popup_id + ' .close_lightbox').click(function(){
                    removeLightbox.hide();
                    $(".lightbox-lid h3, .lightbox-container div", $(popup_id)).show();
                    $(popup_id + " .lightbox-container h3").html($(popup_id).attr('data-detail-info')).hide();
                    $(item).focus();
                    return false;
                });
                $("#remove-listing" + item_index).click(function() {
                    var that = this;
                    $.ajax({
                        url:$(that).attr("data-url") + $(this).attr("data-remove"),
                        complete:function(data) {
                            var newData = $.parseJSON(data.responseText);
                            if(newData.statusCode == "SUCCESS" || newData.statusCode == "WARN"){
                                $(".lightbox-lid h3, .lightbox-container div", $(popup_id)).hide();
                                $(popup_id + " .lightbox-container h3").show();
                                $("#ticket-status" + item_index).html($(popup_id).attr("data-ticket-status"));
                            }
                            else if(newData.statusCode == "NOAUTH") {
                                window.location.reload();
                            }
                            else {
                                removeListingError(popup_id);
                            }
                        },
                        error:function() {
                            removeListingError(popup_id);
                        }
                    });
                    return false;
                });
            });
        });
    };
    
    var popup = function (link, popup, close, direction, pixels) {
      var $this = $("#" + link);
      var $pop = $("#" + popup);
      $this.click(function(e) {
        var scrollY = $(document).scrollTop();
        $(".popup").not($pop).hide();
        if($pop.is(":visible")) {
          $pop.hide();
        }
        else {
          var pos = $this.position();
          $pop.css({
            left:direction === "right" ? pos.left - $pop.width() + $this.width() + pixels : pos.left + pixels,
            top:pos.top + $this.height() + 10,
            display:"block"
          }).focus();
        }
        $(document).scrollTop(scrollY);
        return false;
      });

      $("#" + close).click(function(e) {
        $("#" + popup).hide();
        $("#" + link).focus();
        return false;
      });
    };
    
    return {
        init : init,
        popup : popup
    };
    
})( window.jQuery, window );