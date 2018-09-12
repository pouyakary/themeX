
//
// Copyright 2016-present by Pouya Kary <kary@gnu.org> All rights reserved
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import themeX   = require('./themeX')
    import fs       = require('fs')
    import path     = require('path')
    import jsen     = require('jsen')

//
// ─── CHECKER ────────────────────────────────────────────────────────────────────
//

    export = ( bundle: themeX.IBundle.base ): boolean => {
        return checkProject( bundle.project )
    }

//
// ─── CHECK PROJECT ──────────────────────────────────────────────────────────────
//

    /** Checks to see if a given  */
    function checkProject ( project: themeX.IBundle.project ) {
        const scheme =
            loadScheme( '../schemes/themeX.project.schema.json' )
        const validate =
            jsen( scheme )

        return validate( project )
    }

//
// ─── LOAD SCHEMES ───────────────────────────────────────────────────────────────
//

    function loadScheme ( scheme: string ) {
        try {
            const file = fs.readFileSync(
                path.join( __dirname, scheme ), 'utf8'
            )
            return JSON.parse( file )
        } catch ( err ) {
            return null
        }
    }

// ────────────────────────────────────────────────────────────────────────────────
