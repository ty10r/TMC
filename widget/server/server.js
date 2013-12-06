var express = require('express');
require('./global.js')
var api = require(API_CORE);
var req = require('request');


var app = express();
app.use(express.bodyParser());
app.use(express.static(WEB_PATH));

var goodExample = {
    "predictions": [
        {
            "days": 22,
            "prices": [
                10,
                24.5,
                36
            ],
            "probabilities": [
                0.9,
                0.3,
                0.1
            ]
        },
        {
            "days": 21,
            "prices": [
                11,
                27.5,
                39
            ],
            "probabilities": [
                0.9,
                0.5,
                0.3
            ]
        },
        {
            "days": 20,
            "prices": [
                5,
                15,
                39
            ],
            "probabilities": [
                0.99,
                0.7,
                0.2
            ]
        },
        {
            "days": 19,
            "prices": [
                10,
                20,
                30
            ],
            "probabilities": [
                0.9,
                0.5,
                0.3
            ]
        },
        {
            "days": 18,
            "prices": [
                8,
                19,
                22
            ],
            "probabilities": [
                0.9,
                0.6,
                0.4
            ]
        },
        {
            "days": 17,
            "prices": [
                10,
                20,
                30
            ],
            "probabilities": [
                0.9,
                0.4,
                0.1
            ]
        },
        {
            "days": 16,
            "prices": [
                13,
                20,
                29
            ],
            "probabilities": [
                0.9,
                0.5,
                0.3
            ]
        },
        {
            "days": 15,
            "prices": [
                8,
                13,
                15
            ],
            "probabilities": [
                0.9,
                0.5,
                0.3
            ]
        },
        {
            "days": 14,
            "prices": [
                1,
                2,
                3
            ],
            "probabilities": [
                0.9,
                0.5,
                0.3
            ]
        },
        {
            "days": 13,
            "prices": [
                10,
                20,
                30
            ],
            "probabilities": [
                0.9,
                0.5,
                0.3
            ]
        },
        {
            "days": 12,
            "prices": [
                1,
                11,
                19
            ],
            "probabilities": [
                0.9,
                0.5,
                0.3
            ]
        }
    ],
    "ticket_desc": {
        "barcode": "123559520",
        "seat": "112/3/9",
        "price": 119,
        "team": "Atlanta Falcons Vs. Carolina Panthers",
        "time_to_event": 22
    }
}
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
    if ( request.body.barcode == '12345678' ) {
        data = goodExample;
        data.predictions = formatPredictions(data.predictions);
        api.JsonResponse(data, response, 200);
        return;
    }
    req("http://ec2-54-224-130-193.compute-1.amazonaws.com:2013/example-service/rest/prediction/" + request.body.barcode, function(error, res, body) {
        var data = JSON.parse(body);
        if ( !data.predictions ) {
            api.JsonResponse('Invalid barcode.', response, 200);
            return;
        }
        data.predictions = formatPredictions(data.predictions);
        api.JsonResponse(data, response, 200);
    });
});

app.listen(8000);
