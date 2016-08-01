
//
// Theme - A general color scheme theme generator
//  Copyright 2016 Kary Foundation, Inc. All Rights Reserved.
//  Authored by Pouya Kary <k@karyfoundation.org>
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import themeX   = require('./themeX');
    import check    = require('./checkcore');
    import fs       = require('fs');
    import path     = require('path');
    import colors   = require('colors');

//
// ─── BUILD ──────────────────────────────────────────────────────────────────────
//

    export = ( project: themeX.IBundle.base , address: string ): boolean => {
        if ( !check( project ) ) return false;
        applyBuild( project, address );
    }

//
// ─── APPLY BUILD TO PROJECT ─────────────────────────────────────────────────────
//

    function applyBuild ( project: themeX.IBundle.base, address: string ) {
        setupBuildsDirectory( address );

        let adaptorDirectory = getAdaptorDirectoryLocation( );
        fs.readdir( adaptorDirectory, ( err , files ) => {
            files.forEach( subDirectory => {

                if ( /.adaptorX$/.test( subDirectory ) ) {
                    var adaptor = <themeX.IAdaptor> require(
                        path.join( adaptorDirectory , subDirectory )
                    );

                    try {
                        themeX.print(`running adaptor ${ subDirectory } (v${ adaptor.version })`);

                        setupAdaptorEnvironment( adaptor, address );
                        adaptor.generate( project, address );
                    } catch ( error ) {
                        themeX.report( `Could not generate theme for ${ adaptor.editorName.magenta }` );
                    }
                }
            })
        });
    }

//
// ─── SETUP BUILD FOLDERS ────────────────────────────────────────────────────────
//

    function setupBuildsDirectory ( address: string ) {
        let dir = themeX.buildsDirectoryPath( address );
        if ( !fs.existsSync( dir ) ) {
            fs.mkdirSync( dir );
        }
    }

//
// ─── SETUP ADAPTOR ENVIRONMENT ──────────────────────────────────────────────────
//

    function setupAdaptorEnvironment ( adaptor: themeX.IAdaptor, address: string ) {
        let projectDir = themeX.adaptorBuildDirectoryPath( adaptor, address );
        fs.mkdirSync( projectDir );
    }

//
// ─── GET ALL THE ADAPTORS ───────────────────────────────────────────────────────
//

    function getAdaptorDirectoryLocation ( ): string {
        return path.join( __dirname , 'adaptors' );
    }

// ────────────────────────────────────────────────────────────────────────────────