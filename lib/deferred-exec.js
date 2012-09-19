/*
 * deferred-exec
 * https://github.com/danheberden/deferred-exec
 *
 * Copyright (c) 2012 Dan Heberden
 * Licensed under the MIT license.
 */
var child_process = require( 'child_process' );
var _ = require( 'lodash' );
_.mixin( require( 'underscore.deferred' ) );
_.mixin( require( 'underscore.string' ).exports() );

var deferredorator = function( type, command, args, options ) {
  options = options || {};
  args = args || [];

  //reduce the fn signature
  if ( type === 'exec' ) {
    options = args;
  }

  var dfd = _.Deferred();
  var trim = _.rtrim;

  if ( options.trim === false ) {
    var trim = function(a){ return a; };
  }

  var hollaback = function( error, stdout, stderr ) {
    if ( error !== null ) {
      dfd.reject( error );
    } else {
      dfd.resolve( trim( stdout ), trim( stderr ), command );
    }
  };

  if ( type === 'file' ) {
    child_process.execFile( command, args, options, hollaback );
  }

  if ( type === 'exec' ) {
    child_process.exec( command, hollaback );
  }

  if ( type === 'spawn' ) {
    var cp = child_process.spawn( command, args, options );
    // set encodings
    cp.stdout.setEncoding( options.encoding || 'utf8' );
    cp.stderr.setEncoding( options.encoding || 'utf8' );
    var stdout = '';
    var stderr = '';

    // new stdio api introduced the exit event not waiting for open pipes
    var eventType = cp.stdio ? 'close' : 'exit';

    cp.stdout.on( 'data', function( data ) {
      stdout += data;
      dfd.notify( data );
    });

    cp.stderr.on( 'data', function( data ) {
      stderr += data;
    });

    cp.on( eventType, function( code ) {
      if ( code !== 0 ) {
        var error = new Error( command + " failed" );
        error.code = code;
        dfd.reject( error );
      } else {
        dfd.resolve( trim( stdout ), trim( stderr ), command );
      }
    });
  }


  return dfd.promise();
};

module.exports = function( command, options ) {
  return deferredorator( 'exec', command, options );
};
module.exports.file = function( command, args, options ) {
  return deferredorator( 'file', command, args, options );
};
module.exports.spawn = function( command, args, options ) {
  return deferredorator( 'spawn', command, args, options );
};
