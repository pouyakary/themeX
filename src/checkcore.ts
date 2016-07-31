
//
// Theme - A general color scheme theme generator
//  Copyright 2016 Kary Foundation, Inc. All Rights Reserved.
//  Authored by Pouya Kary <k@karyfoundation.org>
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import themeX   = require('./themeX');
    import fs       = require('fs');
    import path     = require('path');
    import jsen     = require('jsen');

//
// ─── CHECKER ────────────────────────────────────────────────────────────────────
//

    export = ( bundle: themeX.IBundle.base ): boolean => {
        if ( !checkProject( bundle.project ) ) {
            return false;
        }
        return true;
    }

//
// ─── CHECK PROJECT ──────────────────────────────────────────────────────────────
//

    /** Checks to see if a given  */
    function checkProject ( project: themeX.IBundle.project ) {
        let scheme = loadScheme( '../schemes/themeX.project.schema.json' );
        let validate = jsen( scheme );
        return validate( project )? true : false;
    }

//
// ─── LOAD SCHEMES ───────────────────────────────────────────────────────────────
//

    function loadScheme ( scheme: string ) {
        try {
            let file = fs.readFileSync(
                path.join( __dirname, scheme ), 'utf8'
            );
            return JSON.parse( file );
        } catch ( err ) {
            return null;
        }
    }

// ────────────────────────────────────────────────────────────────────────────────
