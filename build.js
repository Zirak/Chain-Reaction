var http = require( 'http' ),
	querystring = require( 'querystring' ),
	fs = require( 'fs' );

var originalName = 'game.js',
	compressedName = 'game-min.js';


//indiviaul compiler API info
var compilers = [
	{
		name : 'closure compiler',
		host : 'closure-compiler.appspot.com',
		path : '/compile',
		params : {
			compilation_level : 'SIMPLE_OPTIMIZATIONS',
			output_info : 'compiled_code',
			output_format : 'text'
		},
		codeParamName : 'js_code'
	},
	{
		name : 'uglify',
		host : 'marijnhaverbeke.nl',
		path : '/uglifyjs',
		codeParamName : 'js_code'
	}
];

var compile = function ( code, callback ) {
	var compiled = [], finished = 0;

	compilers.forEach(function ( compiler ) {
		console.log( 'sending request to ' + compiler.name );
		var req = http.request({
			host : compiler.host,
			path : compiler.path,
			method : 'POST',
			headers : {
				'content-type' : 'application/x-www-form-urlencoded'
			}
		}, compileEnd );

		var params = compiler.params || {};
		params[ compiler.codeParamName ] = code;

		req.end( querystring.stringify(params) );

		function compileEnd ( resp ) {
			var compiledCode = '';
			resp.on( 'data', function ( body ) {
				compiledCode += body.toString();
			});

			resp.on( 'end', function () {
				compiledCode = lastChanges( compiledCode );
				compiled.push( compiledCode );

				console.log( compiler.name + ' compilation size: ' + compiledCode.length );
				finished++;

				//finished count eq/gt than the number we want, we're done
				if ( finished >= compilers.length ) {
					callback( compiled );
				}
			});
		}
	});
	console.log( '' );

	function lastChanges ( code ) {
		return code
		//replace the setInterval function with a string
			.replace( /function\(\)\s*\{([\s\S]+)\}+,(\d+)/, '\'$1\',$2' )
		//remove any remaining new-line characters
			.replace( /[\n\r]/g, '' );
	}
};


console.log( 'reading file...' );
fs.readFile( originalName, function ( err, data ) {
	if ( err ) {
		throw err;
	}
	compile( data.toString(), function ( compiledCollection ) {
		console.log( '\nfinished all compilations\n' );
		var smallest = chooseSmallest( compiledCollection );
		saveCompiled( smallest );
	});
});

function chooseSmallest ( compiledCollection ) {
	return compiledCollection.sort(function ( a, b ) {
		return a.length - b.length;
	})[ 0 ];
}

function saveCompiled ( compiled ) {
	console.log( 'saving compressed code...' );
	fs.writeFile( compressedName, compiled, saveEnd );
}

function saveEnd ( err ) {
	if ( err ) {
		throw err;
	}

	fs.stat( originalName, function ( err, stats ) {
		if ( err ) {
			throw err;
		}
		console.log( 'original size: ' + stats.size );
	});

	fs.stat( compressedName, function ( err, stats ) {
		if ( err ) {
			throw err;
		}
		console.log( 'compressed size: ' + stats.size );
	});
}