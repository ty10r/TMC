var express = require('express');
var app = express();

//*******************************************
//* HTTP API RESPONSE
//********************************************

// Generic JSON Response
var JsonResponse = exports.JsonResponse = function( params, response, code ) {
	var code = code && code !== 200 ? code : 200;
	var responseObject = {
		status: code === 200 ? 'success' : 'error',
		time: new Date(),
		message: params
	};
	response.json( responseObject, code );
};


app.get('/hello', function(request, response){
	JsonResponse('Hi Everybody! :D', response, 200);
});

app.listen(8000);