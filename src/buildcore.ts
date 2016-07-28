
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
// ─── INTERFACES ─────────────────────────────────────────────────────────────────
//

    interface IAdaptor {
        id: string;
        generate ( project: themeX.IBundle.base );
        editor: string;
        version: string;
        name?: string;
        author?: string;
    }

//
// ─── BUILD ──────────────────────────────────────────────────────────────────────
//

    export = ( project: themeX.IBundle.base ): boolean => {
        if ( !check( project ) ) return false;
        applyBuild( project );
    }

//
// ─── APPLY BUILD TO PROJECT ─────────────────────────────────────────────────────
//

    function applyBuild( project: themeX.IBundle.base ) {
        let adaptorDirectory = getAdaptorDirectoryLocation( );
        fs.readdir( adaptorDirectory, ( err , files ) => {
            files.forEach( subDirectory => {
                if ( /.adaptorX$/.test( subDirectory ) ) {
                    var adaptor = <IAdaptor> require( 
                        path.join( adaptorDirectory , subDirectory ) 
                    );
                    try {
                        console.log(`----> running adaptor version ${ adaptor.version } for ${ adaptor.editor }`);
                        adaptor.generate( project );
                    } catch ( error ) {
                        themeX.report( 2 , `-> themeX error: Could not generate theme for ${ adaptor.editor }.\n   editor: ${ adaptor.id }` );
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