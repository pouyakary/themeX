#! /usr/bin/env node

//
// Theme - A general color scheme theme generator
//  Copyright 2016 Kary Foundation, Inc. All Rights Reserved.
//  Authored by Pouya Kary <k@karyfoundation.org>
//

//
// ─── INCLUDES ───────────────────────────────────────────────────────────────────
//

    import themeX   = require('./themeX');
    import loader   = require('./loader');
    import builder  = require('./buildcore');
    import CLITest  = require('./cli-test');

//
// ─── MAIN ───────────────────────────────────────────────────────────────────────
//

    // starting the software here...
    main( );

    /** Where the software starts. main basically acts as an arg switcher. */
    function main ( ) {
        let args = process.argv.slice( 2 );
        if ( args.length === 0 ) {
            if ( process.cwd( ).toLowerCase( ).endsWith( '.themex' ) ) {
                buildCWD( );

            } else {
                showHelp( );
            }
        } else if ( args.length === 1 ) {
            if ( args[ 0 ].toLowerCase( ).endsWith( '.themex' ) ) {
                buildByFile( args[ 0 ] );

            } else if ( args[ 0 ] === 'test' ) {
                process.exit( CLITest( ) );

            } else {
                showHelp( );
            }
        } else {
            showHelp( );
        }
    }

//
// ─── BUILD WITH CWD ─────────────────────────────────────────────────────────────
//

    function buildCWD ( ) {
        buildByFile( process.cwd( ) );
    }

//
// ─── BUILD BY FILE ──────────────────────────────────────────────────────────────
//

    function buildByFile ( file: string ): boolean {
        themeX.print('initializing themeX');
        let bundle = loader.loadProjectByFile( file );
        return builder( bundle, file );
    }

//
// ─── BUILD ──────────────────────────────────────────────────────────────────────
//

    function build ( bundle: themeX.IBundle.base ) {
        themeX.report( "hello world" );
    }

//
// ─── HELP ───────────────────────────────────────────────────────────────────────
//

    function showHelp ( ) {
        console.log(
            "\n" +
            "  ┌─── themeX ─────────────────────────────────────────────┐\n" +
            "  │                                                        │\n" +
            "  │  themeX provides a simple universal definition for     │\n" +
            "  │  IDE/editor color schemes. To use it please read the   │\n" +
            "  │  documentation from:                                   │\n" +
            "  │  https://github.com/karyfoundation/themeX/wiki         │\n" +
            "  │                                                        │\n" +
            "  └────────────────────────────────────────────────────────┘\n"
        );
    }

// ────────────────────────────────────────────────────────────────────────────────