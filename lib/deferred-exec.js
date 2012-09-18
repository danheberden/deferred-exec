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

module.exports = function( command ) {
  var dfd = _.Deferred();
  child_process.exec( command, function( error, stdout, stderr ) {
    if ( error !== null ) {
      dfd.reject( error );
    } else { 
      dfd.resolve( stdout, stderr, command );
    }
  });
  return dfd.promise();
};
