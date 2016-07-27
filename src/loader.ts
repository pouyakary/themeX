
//
// ─── LOADINGS ───────────────────────────────────────────────────────────────────
//

    import fs       = require('fs');
    import path     = require('path');
    import jsYaml   = require('js-yaml');

//
// ─── SETTINGS LOADER ────────────────────────────────────────────────────────────
//

    /** Loads the project settings */
    export function loadSettings ( ) {

    }

//
// ─── PROJECT LOADER ─────────────────────────────────────────────────────────────
//

    /** Loads the project main yaml file */
    export function project ( address: string ) {
        
    }

//
// ─── FIND AND IMPORT ────────────────────────────────────────────────────────────
//

    

//
// ─── IMPORT YAML ────────────────────────────────────────────────────────────────
//

    function importYAML ( address: string ): Object {
        if ( fs.existsSync( address ) ) {
            let fileString = fs.readFileSync( address, 'utf8' );
            let decodedObject = jsYaml.load( fileString );
            return decodedObject;
        } else {
            return null;
        }
    }

// ────────────────────────────────────────────────────────────────────────────────