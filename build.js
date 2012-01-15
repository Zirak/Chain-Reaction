var http = require( 'http' ),
	querystring = require( 'querystring' ),
	fs = require( 'fs' );

var originalName = 'game.js',
	compressedName = 'game-min.js';

var compile = function ( params ) {
	console.log( 'Sending request...' );

	var req = http.request({
		host : 'closure-compiler.appspot.com',
		path : '/compile',
		headers : {
			'content-type' : 'application/x-www-form-urlencoded'
		},
		method : 'POST'
	}, compileEnd);

	req.end( querystring.stringify(params) );

	function compileEnd ( resp ) {
		resp.on( 'data', function ( body ) {

			var res = JSON.parse( body.toString() ),
			code = lastChanges( res.compiledCode );

			console.log( 'Saving compressed code...\n' );
			fs.writeFile( compressedName, code, saveEnd );
		});
	}

	function lastChanges ( code ) {
		return code
		//replace the setInterval function with a string
			.replace( /function\(\)\s*\{([\s\S]+)\}+,(\d+)/, '\'$1\',$2' )
		//remove any remaining new-line characters
			.replace( /[\n\r]/g, '' );
	}

	function saveEnd ( err ) {
		if ( err ) {
			throw err;
		}

		fs.stat( originalName, function ( err, stats ) {
			if ( err ) {
				throw err;
			}
			console.log( 'Original: ' + stats.size );
		});

		fs.stat( compressedName, function ( err, stats ) {
			if ( err ) {
				throw err;
			}
			console.log( 'Compressed: ' + stats.size );
		});
	}
};

console.log( 'Reading file...' );
fs.readFile( 'game.js', function ( err, data ) {
	if ( err ) {
		throw err;
	}
	data = data.toString();

	compile({
		js_code : data,
		compilation_level : 'SIMPLE_OPTIMIZATIONS',
		output_info : 'compiled_code',
		output_format : 'json'
	});
});