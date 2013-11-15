$( document ).ready( function() {

    //*******************************************
    //* TEST DATA
    //*******************************************

    var ticket = {
        "ticket_desc": {
            "barcode": 123,
            "seat": "Section A Row 2",
            "team": "Ticket Master Team C",
            "price": "$9001",
            "time_to_event": 28
        },
        "predictions": []
    };
    var lastPrice = 0;
    for ( var i = 0; i < 5; i++ ) {
        var predictions = {
            "days": i,
            "pairs": []
        }
        lastPrice = 250;
        for ( var j = 1; j < 4; j++ ) {
            var scale =  9 * (lastPrice/10);
            lastPrice = Math.round((Math.random()*scale)*100)/100;
            predictions.pairs.push({
                "price": lastPrice,
                "probability": j
            });
        }
        ticket.predictions.push(predictions);
    }


    //*******************************************
    //* INIT CLASSES
    //*******************************************
    widget = new PriceRecWidget();

    graph = new PredictionGraph(ticket.predictions);
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

    pScale = ['black', 'green', 'yellow', 'red'];

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

    graph.selectAll("rect")
    .data(flatPredictions)
    .enter()      
    .append("rect")
    .attr("x", function(d) {return xScale(d[0]) - recWidth/2+20;})
    .attr("y", function(d) {return yScale(d[1]);})
    .attr("fill", function(d) { return pScale[d[2]];})
    .attr("width", function(d) {return recWidth;})
    .attr("height", function(d) {return recHeight;});


};

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
