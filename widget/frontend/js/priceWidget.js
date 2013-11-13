$( document ).ready( function() {
    //*******************************************
    //* INIT CLASSES
    //*******************************************
	widget = new PriceRecWidget();

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
		widget.SubmitBarcode();
	});

});


var PriceRecWidget = function() {
	var self = this;
	var MAXBARCODELENGTH = 120; //TODO: Fix this number.

	self.SubmitBarcode = function() {
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
			// TODO: Change this to actual functionality..not indication of receipt
			self.ReportError( error ? error : message );
		});
	};

	self.ReportError = function( error ) {
		$('.price-rec .error-feedback').html(error);
	};

	self.ShowRecommendation = function( ) {
		// TODO
	};
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