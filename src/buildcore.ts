
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
        let adaptorDirectory = getAdaptorDirectoryLocation( );
        fs.readdir( adaptorDirectory, ( err , files ) => {
            files.forEach( subDirectory => {
                if ( /.adaptorX$/.test( subDirectory ) ) {
                    var adaptor = <themeX.IAdaptor> require(
                        path.join( adaptorDirectory , subDirectory )
                    );
                    try {
                        themeX.print(`running adaptor "${ subDirectory }" (v${ adaptor.version })`);
                        adaptor.generate( project, address );
                    } catch ( error ) {
                        themeX.report( 5, `Could not generate theme for ${ adaptor.editorName }.\n      Adaptor: ${ adaptor.id }` );
                    }
                }
            })
        });
    }

//
// ─── GET ALL THE ADAPTORS ───────────────────────────────────────────────────────
//

    function getAdaptorDirectoryLocation ( ): string {
        return path.join( __dirname , 'adaptors' );
    }

// ────────────────────────────────────────────────────────────────────────────────