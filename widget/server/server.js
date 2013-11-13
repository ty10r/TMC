var express = require('express');
require('./global.js')
var api = require(API_CORE);
var app = express();

// Static Files
app.use(express.static(WEB_PATH));

app.get('/hello', function(request, response){
	JsonResponse('Hi Everybody! :D', response, 200);
});

app.get('/my_account', function(request, response){
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

app.listen(8000);