#! /usr/bin/env node

//
// Theme - A general color scheme theme generator
//  Copyright 2016 Kary Foundation, Inc. All Rights Reserved.
//  Authored by Pouya Kary <k@karyfoundation.org>
//

//
// ─── INCLUDES ───────────────────────────────────────────────────────────────────
//

    import gi       = require('./interfaces');
    import loader   = require('./loader');
    import builder  = require('./buildcore');

//
// ─── CONSTANTS ──────────────────────────────────────────────────────────────────
//

    const themeXFileFormat = '.themeX';

//
// ─── MAIN ───────────────────────────────────────────────────────────────────────
//

    /** Where the software starts. main basically acts as an arg switcher. */
    function main ( ) {
        let args = process.argv.slice( 2 );
        if ( args.length == 0 ) {
            buildCWD( );
        } else if ( args.length === 1 ) {
            if ( args[ 0 ].toLowerCase( ).endsWith( '.themex' ) ) {
                buildByFile( args[ 0 ] );
            } else {
                showHelp( );
            }
        } else {
            showHelp( );
        }
    }

    main( );

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
        let bundle = loader.loadProjectByFile( file );
        return builder( bundle );
    }

//
// ─── BUILD ──────────────────────────────────────────────────────────────────────
//

    function build ( bundle: gi.bundle.base ) {
        report( 1 , "hello world" );
    }

//
// ─── LOAD MODEL ─────────────────────────────────────────────────────────────────
//



//
// ─── REPORT ERROR ───────────────────────────────────────────────────────────────
//

    function report ( errorNumber: number, errorMessage: string ) {
        console.log(`-> themeX E${ errorNumber }: ${ errorMessage }`);
    }

//
// ─── HELP ───────────────────────────────────────────────────────────────────────
//

    function showHelp ( ) {
        
    }

// ────────────────────────────────────────────────────────────────────────────────