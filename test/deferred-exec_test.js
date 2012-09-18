var deferred_exec = require('../lib/deferred-exec.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['general'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'exec stdout' : function( test ) {
    test.expect(4);
    deferred_exec( 'echo "hi"' )
      .done( function( stdout, stderr, command ) {
        test.ok( true, '.done should fire' );
        test.equal( command, 'echo "hi"', 'original command should match sent copy' );
        test.equal( stdout, 'hi\n', 'result should match actual command result' );
        test.equal( stderr, '', 'stderr should be empty' );
        test.done();
      })
      .fail( function() {
        test.ok( false, '.fail should not have fired' );
        test.done();
      });
  },
  'exec stderr': function( test ) {
    test.expect(4);
    deferred_exec( 'echo "hi" 1>&2' )
      .done( function( stdout, stderr, command ) {
        test.ok( true, '.done should fire' );
        test.equal( command, 'echo "hi" 1>&2', 'original command should match sent copy' );
        test.equal( stderr, 'hi\n', 'stderr should match echoed text' );
        test.equal( stdout, '', 'stdout should be empty' );
        test.done();
      })
      .fail( function() {
        test.ok( false, '.fail should not have fired' );
        test.done();
      });
  },
  'errors work': function( test ) {
    test.expect(2);
    deferred_exec( 'someprogramthatdoesntexistunlessyoureajerkandcreatedthisjusttofailthetest' )
      .fail( function( error ) {
        test.ok( true, '.fail should fire' );
        test.equal( error.code, 127, 'should have exited with a 127 error code' );
        test.done();
      })
      .done( function() {
        test.ok( false, '.done should not have fired' );
        test.done();
      });
  },
  'file works': function( test ) {
    test.expect(4);
    deferred_exec.file( 'test/test.sh' )
      .done( function( stdout, stderr, fileName ) {
        test.ok( true, '.done should fire' );
        test.equal( stdout, 'bash script\n', 'stdout should match file output' );
        test.equal( stderr, '', 'there should be no stderr content' );
        test.equal( fileName, 'test/test.sh', 'fileName should match original file' );
        test.done();
      })
      .fail( function() {
        test.ok( false, '.fail should not have fired' );
        test.done();
      });
  }
};
