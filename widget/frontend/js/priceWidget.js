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
        event.preventDefault();
        event.stopPropagation();
        widget.SelectTab($(this).attr('id'));
    })

});

// d3 graph
PredictionGraph = function( predictions ) {
    var width = 620;
    var height = 320;
    var margin = 40;
    var priceTicks = 5;
    var recWidth = 20;
    var recHeight = 40;

    // Set Up Graph scales
    var maxPrices = []
    var minPrices = []
    for (var i = 0; i < predictions.length; i ++) {
        maxPrices.push(d3.max(predictions[i].pairs, function(pair) {
            return pair.price;
        }));
        minPrices.push(d3.min(predictions[i].pairs, function(pair) {
            return pair.price;
        }));
    }

    yScale = d3.scale.linear().range([height - margin*2, margin])
                                   .domain([d3.min(minPrices, function(price) {return price;}),
                                             d3.max(maxPrices, function(price) {return price;})])

    xScale = d3.scale.linear().range([margin, width - margin])
                                   .domain([d3.min(predictions, function(prediction) {return prediction.days;}),
                                            d3.max(predictions, function(prediction) {return prediction.days;})]);

    // Red          = (208, 5, 9)
    // Orange       = (210, 135, 5)
    // Yellow       = (210, 210, 5)
    // Y-green      = (169, 210, 5)
    // green        = (66, 210, 5)

    pScale = d3.scale.quantize().range([ d3.rgb(66, 210, 5), d3.rgb(169, 210, 5),
                                         d3.rgb(210, 210, 5), d3.rgb(210, 135, 5), d3.rgb(208, 5, 10) ])
                                .domain([100, 25]);


    // Draw graph svg element
    self.graph = d3.select( ".graph-container" )
    .append( "svg" )
    .attr( "id", "prediction-graph" )
    .attr( "width", width + "px" )
    .attr( "height", height + "px" );

    // Draw Axes
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(4);
    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(6);
    graph.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(20," + (height - margin) + ")")
         .call(xAxis);

    graph.append("g")
         .attr("class", "axis")
        .attr("transform", "translate(" + (margin) + ",0)")
         .call(yAxis);

    // flatten predictions
    var flatPredictions = []
    for (var i = 0; i < predictions.length; i++) {
        for ( var j = 0; j < predictions[i].pairs.length; j++ ) {
            flatPredictions.push([predictions[i].days, predictions[i].pairs[j].price, predictions[i].pairs[j].probability]);
        }
    }

    // draw predictions on graph
    graph.selectAll("rect")
    .data(flatPredictions)
    .enter()      
    .append("rect")
    .attr("x", function(d) {return xScale(d[0]) - recWidth/2+20;})
    .attr("y", function(d) {return yScale(d[1]);})
    .attr("fill", function(d) {
        console.log(d[2]);
        console.log(pScale(d[2] * 100))
        return pScale(d[2] * 100);})
    .attr("width", function(d) {return recWidth;})
    .attr("height", function(d) {return recHeight;});
};

var PriceRecWidget = function() {
	var self = this;
	var MAXBARCODELENGTH = 120; //TODO: Fix this number.
    self.graph = null;

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
		$("div.recommendations").show();
        Request({
                url: '/priceRec',
                type: 'POST',
                data: {
                    barcode: bCode
                }
            },
            function (error, ticketData) {
                console.log(ticketData.predictions)
                if ( error ) {
                    $("div.suggestion").text("Could not retrieve.");
                    return;
                } 
                for (var info in ticketData.ticket_desc) {
                    if (ticketData.ticket_desc.hasOwnProperty(info)) {
                        $("#info-" + info).html(ticketData.ticket_desc[info]);
                    }
                }
                if ( ticketData.predictions[0].pairs[0].price < oPrice ) 
                    $("div.suggestion").css('color', '#D00509');
                else
                    $("div.suggestion").css('color', 'black');

                $("div.suggestion").text("$" + ticketData.predictions[0].pairs[2].price);
                self.graph = new PredictionGraph(ticketData.predictions);

            })
		self.SelectTab("simple");
	};

	self.SelectTab = function( tabNavId ) {
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
