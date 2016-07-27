#! /usr/bin/env node

//
// Theme - A general color scheme theme generator
//  Copyright 2016 Kary Foundation, Inc. All Rights Reserved.
//  Authored by Pouya Kary <k@karyfoundation.org>
//

//
// ─── INCLUDES ───────────────────────────────────────────────────────────────────
//

    // libs


    // files
    import loader   = require('./loader');

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
        switch ( args[ 0 ] ) {
            case 'build':
            case undefined:
                build( );
        }
    }

    main( );

//
// ─── BUILD ──────────────────────────────────────────────────────────────────────
//

    function build ( ) {
        report( 1 , "hello world" );
        loader.loadSettings( );
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

// ────────────────────────────────────────────────────────────────────────────────