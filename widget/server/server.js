var express = require('express');
require('./global.js')
var api = require(API_CORE);
var req = require('request');


var app = express();
app.use(express.bodyParser());
app.use(express.static(WEB_PATH));

app.get( '/hello', function( request, response ) {
        req("http://ec2-54-224-130-193.compute-1.amazonaws.com:2013/example-service/rest/prediction/123559520", function(error, res, body) {
        response.json(JSON.parse(body), 200);
    });
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
            '/css/priceWidget.css',
            '/css/bootstrap.min.css' 
            ],
        js: [
            '/js/priceWidget.js',
            '/js/lib/jquery-1.10.2.min.js'
        ]
    });
});

app.get("/widget", function(request, response) {
  api.RenderPage({
    template: 'priceWidget.mustache',
    response: response,
    request: request
  },
  {
    title: 'Widget Demo',
    css: [
           '/css/priceWidget.css'
         ],
    js:  [
         '/js/priceWidget.js',
         '/js/lib/jquery-1.10.2.min.js'
    ]
  });
});

// TODO: Move this function somwhere smarter
function formatPredictions( predictions ) {
    var formattedPredictions = [];

    predictions.forEach( function( prediction ) {
        var formattedPrediction = {
            days: prediction.days,
            pairs: []
        };

        for (var i = 0; i < prediction.prices.length; i++) {
            var pair = {
                price: prediction.prices[i],
                probability: prediction.probabilities[i]
            };
            formattedPrediction.pairs.push(pair);
        };
        formattedPredictions.push(formattedPrediction);
    });
    return formattedPredictions;
}

app.post('/priceRec', function(request, response) {
    req("http://ec2-54-224-130-193.compute-1.amazonaws.com:2013/example-service/rest/prediction/" + request.body.barcode, function(error, res, body) {
        var data = JSON.parse(body);
        if ( !data.predictions ) {
            api.JsonResponse('Invalid barcode', 500);
            return;
        }
        data.predictions = formatPredictions(data.predictions);
        api.JsonResponse(data, response, 200);
    });
});

app.listen(8000);
