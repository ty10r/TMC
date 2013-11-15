$( document ).ready( function() {
    //*******************************************
    //* INIT CLASSES
    //*******************************************
	widget = new PriceRecWidget();
	var bCode;
    //*******************************************
    //* SET INIT STATE
    //*******************************************
	$('div.recommendations').hide();

    //*******************************************
    //* SET EVENT LISTENERS
    //*******************************************
	$('#submit-barcode').bind('click', function( event ) {
        event.preventDefault();
        event.stopPropagation();
		widget.SubmitBarcode(bCode);
	});
	
	// mock demo for ticket stub checkboxes
	$( "#addTicket button" ).bind('click', function( event ) {
		bCode = 111000 + $(this).attr("data-index");
		$( '#barcode' ).val(bCode);
	});
	// end mock demo

	$('.tab-selector').bind('click', function( event ) {
		widget.SelectTab($(this).attr('id'));
	})

});


var PriceRecWidget = function() {
	var self = this;
	var MAXBARCODELENGTH = 120; //TODO: Fix this number.

	self.SubmitBarcode = function(bCode) {
		var barcode = $( '#barcode' ).val();
		if ( !barcode ) {
			self.ReportError( 'Please input a barcode' );
			return;
		}
		if ( barcode.length >  MAXBARCODELENGTH ) {
			self.ReportError( 'Please input a valid barcode' );
			return;
		}
		
		Request({
			url: '/priceRec',
			type: 'POST',
			data: {
				barcode: barcode
			}
		},
		function( error, message ) {
			if ( error ) {
				self.ReportError( error );
			}
			self.RenderRecommendation(bCode, 228);
		});
	};

	self.ReportError = function( error ) {
		$('.price-rec .error-feedback').show();
		$('.price-rec .error-feedback').html(error);
	};

	self.RenderRecommendation = function(bCode, oPrice) {
		$(".prompt").hide();
		// TODO: Build the graph
		$("div.recommendations").show();
		// mockup demo code
		var reurl = 'http://ec2-50-19-197-53.compute-1.amazonaws.com:40000/axis2/services/Recommender/echo?message=111001&response=application/json';
		var jsonurl = 'http://hellojohnlee.homeip.net:40000/axis2/services/Recommender/echo?message=' + bCode + '&response=text/plain';
		var jqxhr = $.getJSON(jsonurl, {
		})
			.done(function(data) {
				var t = $.parseJSON(data.return);
				var price = t.price;
				if (oPrice > parseInt(price)) {
					$("div.suggestion").css('color', 'red');
				} else $("div.suggestion").css('color', 'black');
				$("div.suggestion").text("$" + t.price);
				$("div.rec-ticket-info").text("Ticket Number: " + bCode);
				$("div.rec-ticket-info2").text("Days to Event: " + t.daysToEvent);
			});
		// end mockup demo code
		self.SelectTab("simple");
	};

	self.SelectTab = function( tabNavId ) {
		console.log(tabNavId);
		$('.tab-selector').attr("class", "tab-selector");
		$('.tab').attr("class", "tab");
		$('#' + tabNavId).attr("class", "tab-selector active-selector");
		$('#' + tabNavId +'-tab' ).attr("class", "tab active-tab");
	}
}

// API Request Helper
Request = function( params, callback ) {
    $.ajax({
        url: params.url,
        type: params.type || 'GET',
        data: params.data || null,
        cache: params.cache || false,
        success: function( data ) {
            data = typeof( params.message ) !== 'undefined' && params.message === false && typeof( data.message ) !== 'undefined' ? data : data.message;
            if ( callback ) callback( null, data );
        },
        error: function( xhr ) {
            return;
            var jsonError = JSON.parse( xhr.responseText );
            if ( callback ) callback( jsonError && jsonError.message ? jsonError.message : xhr.responseText, null );
        }
    });
}