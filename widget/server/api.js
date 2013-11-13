var mustache =      exports.mustache = require( 'mu2' ),
    fs =            require( 'fs' );

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


//*******************************************
//* CONTROLLER METHODS
//*******************************************

// Used to add specific CSS or JS files to controllers
var AddResources = exports.AddResources = function( arr ) {
    objArr = [];
    arr.forEach( function( arrFile ) {
        objArr.push( { file: arrFile } );
    });
    return objArr;
};

// Compile Page Template
var RenderPage = exports.RenderPage = function( controllerParams, pageParams, callback ) {

    // Grab the server request and response obj
    var request = controllerParams.request;
    var response = controllerParams.response;

    // Set the mustache template root
    mustache.root = TEMPLATE_PATH;

    // Buid the full path to the specified page template (so we can stat the file system)
    var pageTemplate = controllerParams.template;
    var pageTemplatePath = mustache.root + '/' + pageTemplate;

    // Configure the response header
    response.header( 'Content-Type', 'text/html' );

    // Configure CSS or JS arrays to be parsable by MU2. This is due to a bug on backend Mutache.js
    if ( pageParams.css )
        pageParams.css = AddResources( pageParams.css );

    if ( pageParams.js )
        pageParams.js = AddResources( pageParams.js );

    // Hacky way of determing what page we're on (for nav)
    if ( !pageParams.current_page ) {
        pageParams.current_page = {};
        pageParams.current_page[ controllerParams.template.replace( '.mustache', '' ) + '_link' ] = true;        
    }

    // Prepopulated pageParams (stuff that gets piped on every page load)
    if ( !pageParams.user )
        pageParams.user = request && request.user ? request.user : null;

    // In case the specified template doesn't exist
    try {

        // Grab the template contents
        fs.readFile( pageTemplatePath, function( error, data ) {

            // TODO: This should be a 404 page
            if ( error ) {
                response.send( error, 500 );
                return;
            }

            // If we go this far, then the template exists
            mustache.compile( pageTemplate, function( error, compiledTemplate ) {

                // Throw a 500 error if the compile failed
                if ( error ) {
                    response.send( error, 500 );
                    return;
                }

                // Begin rendering and stream the contents of the web page out as we render them
                var rendered = '';
                var stream = mustache.render( compiledTemplate, pageParams );
                var Readable = require( 'stream' ).Readable;
                var newStream = new Readable().wrap( stream );

                newStream.on( 'data', function( newRendered ) {
                    rendered += newRendered; 
                });

                newStream.on( 'end', function() {
                    // cache this shit? probably not
                });

                newStream.pipe(response);
            });
        });
    }
    catch( e ) {
        // This should be a 404 page too
        response.send( e, 500 );
    }
};