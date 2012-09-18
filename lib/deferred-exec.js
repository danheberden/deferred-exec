/*
 * deferred-exec
 * https://github.com/danheberden/deferred-exec
 *
 * Copyright (c) 2012 Dan Heberden
 * Licensed under the MIT license.
 */
var child_process = require( 'child_process' );
var _ = require( 'lodash' );
_.mixin ( require( 'underscore.deferred' ) );

var deferredorator = function( type, command, args, options ) {
  var dfd = _.Deferred();
  var hollaback = function( error, stdout, stderr ) {
    if ( error !== null ) {
      dfd.reject( error );
    } else { 
      dfd.resolve( stdout, stderr, command );
    }
  };

  if ( type === 'file' ) {
    child_process.execFile( command, args, options, hollaback );
  } 
  if ( type === 'exec' ) {
    child_process.exec( command, hollaback );
  }
  return dfd.promise();
};

module.exports = function( command ) {
  return deferredorator( 'exec', command );
};
module.exports.file = function( command, args, options ) {
  return deferredorator( 'file', command, args, options );
};
