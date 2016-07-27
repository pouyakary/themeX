
//
// Theme - A general color scheme theme generator
//  Copyright 2016 Kary Foundation, Inc. All Rights Reserved.
//  Authored by Pouya Kary <k@karyfoundation.org>
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import fs   = require('fs');
    import path = require('path');
    import gi   = require('./interfaces');
    import jsen = require('jsen');

//
// ─── CHECKER ────────────────────────────────────────────────────────────────────
//

    export = ( bundle: gi.bundle.base ): boolean => {
        if ( !checkProject( bundle.project ) ) {
            return false;
        }
        return true;
    }

//
// ─── CHECK PROJECT ──────────────────────────────────────────────────────────────
//

    /** Checks to see if a given  */
    function checkProject ( project: gi.bundle.project ) {
        let scheme = loadScheme( 'themeX.project.schema.json' );
        let validate = jsen( scheme );
        if ( validate( project ) ) {
            return true;
        } else {
            return false;
        }
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
