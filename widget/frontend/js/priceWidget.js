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
PredictionGraph = function( predictions, height, width ) {
    var lrPadding = width/20;
    var bottomPadding = height/10;
    var recWidth = (width-2*lrPadding)/20;

    // Set Up Graph scales
    var maxPrices = []
    var minPrices = []
    for (var i = 0; i < predictions.length; i++) {
        maxPrices.push(d3.max(predictions[i].pairs, function(pair) {
            return pair.price;
        }));
        minPrices.push(d3.min(predictions[i].pairs, function(pair) {
            return pair.price;
        }));
    }

    var yScale = d3.scale.linear().range([height - bottomPadding, bottomPadding])
                                   .domain([d3.min(minPrices, function(price) {return price;}),
                                             d3.max(maxPrices, function(price) {return price;})])

    var xScale = d3.scale.linear().range([lrPadding, width-lrPadding])
                                   .domain([d3.min(predictions, function(prediction) {return prediction.days;}),
                                            d3.max(predictions, function(prediction) {return prediction.days;})]);


    // Red              Orange              Yellow              Y-green             green
    // (208, 5, 9)      (210, 135, 5)       (210, 210, 5)       (169, 210, 5)       (66, 210, 5)
    var colorScale = d3.scale.quantize().range([ d3.rgb(66, 210, 5), d3.rgb(169, 210, 5),
                                         d3.rgb(210, 210, 5), d3.rgb(210, 135, 5), d3.rgb(208, 5, 10) ])
                                    .domain([100, 25]);


    // Draw graph svg element
    self.graph = d3.select( ".graph-container" )
    .append( "svg" )
    .attr( "id", "prediction-graph" )
    .attr( "viewBox", "0 0 " + width + " " + height)
    .attr( "preserveAspectRation", "xMidYMid")
    .attr( "width", width + "px" )
    .attr( "height", height + "px" );

    // Draw Axes
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(predictions.length);
    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(6);
    graph.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(0," + (height-bottomPadding) + ")")
         .call(xAxis);

    graph.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(" + lrPadding + ",0)")
         .call(yAxis);

    var defs = graph.append('defs');
    for (var i = 0; i < predictions.length; i++) {
        var prediction = predictions[i];
        var gradientId = "gradient-" + prediction.days;
        var lastInd = prediction.pairs.length - 1;

        // Build relative scale for day's gradient (percentage)
        var gradScale = d3.scale.linear().range([100, 0])
                                         .domain([prediction.pairs[0].price, prediction.pairs[lastInd].price]);

        // Define gradient for day
        var gradient = defs.append("svg:linearGradient")
                           .attr("id", gradientId)
                           .attr("x1", "0%")
                           .attr("y1", "0%")
                           .attr("x2", "0%")
                           .attr("y2", "100%");
        for (var j = prediction.pairs.length - 1; j >= 0; j--) {
            gradient.append("svg:stop")
                    .attr("offset", gradScale(prediction.pairs[j].price)+'%')
                    .attr("stop-color", colorScale(prediction.pairs[j].probability * 100))
        }
        // Draw day's rectangle with gradient fill.
        graph.append("rect")
            .attr("x", xScale(prediction.days))
            .attr("y", yScale(prediction.pairs[lastInd].price))
            .attr("width", recWidth)
            .attr("height", yScale(prediction.pairs[0].price) - yScale( prediction.pairs[lastInd].price) )
            .attr("fill", "url(#" + gradientId + ")");
    };
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
                $("div.suggestion").text("Could not retrieve.");
                return;
			}
			self.RenderRecommendation( message );
		});
	};

	self.ReportError = function( error ) {
		$('.price-rec .error-feedback').show();
		$('.price-rec .error-feedback').html(error);
	};

    self.SetResizeListener = function() {
        // Assumes graph has already been rendered.
        var graphAspect = 680/260;
        var graph = $("#prediction-graph");

        $(window).resize(function() {
            var targWidth = graph.parent().width() * .92;
            graph.attr('width', targWidth);
            graph.attr('height', targWidth / graphAspect);
        });
    };

	self.RenderRecommendation = function( ticketData ) {
		$(".prompt").hide();
		$("div.recommendations").show();
        
        for (var info in ticketData.ticket_desc) {
            if (ticketData.ticket_desc.hasOwnProperty(info)) {
                $("#info-" + info).html(ticketData.ticket_desc[info]);
            }
        }
        if ( ticketData.predictions[0].pairs[0].price < ticketData.ticket_desc.price ) 
            $("div.suggestion").css('color', '#D00509');
        else
            $("div.suggestion").css('color', 'black');

        $("div.suggestion").text("$" + ticketData.predictions[0].pairs[2].price);
        self.graph = new PredictionGraph(ticketData.predictions, 260, 680);
        self.SetResizeListener();

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
