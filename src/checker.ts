
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
    import ajv  = require('ajv');
 
//
// ─── CHECKER ────────────────────────────────────────────────────────────────────
//

    export = ( bundle: gi.bundle.base ): boolean => {
        
    }

//
// ─── CHECK PROJECT ──────────────────────────────────────────────────────────────
//

    function checkProject ( ) {
        let scheme = loadScheme('themeX.project.schema.json');

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
