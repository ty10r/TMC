var express = require('express');
require('./global.js')
var api = require(API_CORE);


var app = express();
app.use(express.bodyParser());
app.use(express.static(WEB_PATH));

app.get( '/hello', function( request, response ) {
	api.JsonResponse('Hi Everybody! :D', response, 200);
});

app.get( '/my_account', function( request, response ) {
	api.RenderPage({
        template: '130_static_mock.mustache',
        response: response,
        request: request
    },
    {
    	title: 'Ticket Master | My Account',
    	css: [ 
            '/css/priceWidget.css' 
            ],
        js: [
            '/js/priceWidget.js',
            '/js/lib/jquery-1.10.2.min.js'
        ]
    });
});

app.post( '/priceRec', function( request, response ) {

    console.log('got request')
    var ticket = {
        "ticket_desc": {
            "barcode": 123,
            "seat": "Section A Row 2",
            "team": "Ticket Master Team C",
            "price": "$9001",
            "time": "28 days"
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

    api.JsonResponse( ticket, response );
});

app.listen(8000);