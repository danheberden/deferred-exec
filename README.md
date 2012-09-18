# deferred-exec

Deferred based tool to run exec commands

## Installing

Install the module with: `npm install deferred-exec` or add it to your project's `package.json` file.

You can also clone this repo and `npm install folderOfClonedRepo` to get a branch or development copy.

## Using

All calls return a promise, which means it's easy to do stuff when they complete or fail:

```javascript
var dexec = require( 'deferred-exec' );

dexec( 'echo "yay"' )
  .done( function( stdout, stderr, command ) {
    console.log( stdout ); // logs "yay"
  })
  .fail( function( error ) {
    console.log( "it didn't work :( got code:", error.code );
  });
```

Since they are deferreds, you can pass them around in your code:

```javascript
var dexec = require( 'deferred-exec' );

var command = dexec( 'echo "gotcha"' );

doSomethingWithCommand( command );

// meanwhile, in some other part of your application
function doSomethingWithCommand( command ) {
  command.done( function( stdout, stderr, command ) {
    console.log( 'just ran', command, 'and got', stdout );
  });
}
```

Use [Underscore.Deferred](https://github.com/wookiehangover/underscore.deferred) if you want to use
`_.when` to group multiple commands. (Note: you can use underscore.deferred with [lodash](https://github.com/bestiejs/lodash))

```javascript
var dexec = require( 'deferred-exec' );

// require and mixin lodash with _.deferred
var _ = require( 'lodash' );
_.mixin( require( 'underscore.deferred' ) );

var commandA = dexec( 'ls /etc' );
var commandB = dexec( 'echo "hi"' );

// when both commands succeed
_.when( commandA, commandB )
  .done( function( a, b ){
    console.log( 'commandA output:', a[0] );
    console.log( 'commandB output:', b[0] );
  });
```

Or run a file using `.file` 

```javascript
var dexec = require( 'deferred-exec' );

dexec.file( './someFile.sh' )
  .done( function( stdout, stderr, fileName ) {
    console.log( 'ran', fileName, 'got', stdout );
  });
```
  

## Reference

For `deferred-exec` details see [child_process.exec](http://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback) for available options

For `deferred-exec.file` details see [child_process.execFile](http://nodejs.org/api/child_process.html#child_process_child_process_execfile_file_args_options_callback)
for available options



## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## License
Copyright (c) 2012 Dan Heberden  
Licensed under the MIT license.
