var express = require('express');
require('./global.js')
var api = require(API_CORE);
var app = express();

// Static Files
app.use(express.static(PUBLIC));

app.get('/hello', function(request, response){
	JsonResponse('Hi Everybody! :D', response, 200);
});

app.get('/my_account', function(request, response){
	console.log('request recieved.')
	api.RenderPage({
        template: '130_static_mock.mustache',
        response: response,
        request: request
    },
    {
    	title: 'Ticket Master | My Account',
    	css: [ 
            '/css/priceWidget.css' 
            ]
    });
});

app.listen(8000);