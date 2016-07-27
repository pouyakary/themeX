
//
// ─── LOADINGS ───────────────────────────────────────────────────────────────────
//

    import gi       = require('./interfaces');
    import jsYaml   = require('js-yaml');
    import fs       = require('fs');
    import path     = require('path');

//
// ─── ENUMS ──────────────────────────────────────────────────────────────────────
//

    enum fileType {
        project, settings
    }

//
// ─── LOAD BY FILE NAME ──────────────────────────────────────────────────────────
//

    export function loadProjectByCWD ( ) {
        return loadProjectByFile( process.cwd( ) );
    }

//
// ─── LOAD BY CURRENT WORKING DIRECTORY ──────────────────────────────────────────
//

    /** Loads the project main yaml file */
    export function loadProjectByFile ( file: string ): gi.bundle.base {
        if ( file.toLowerCase( ).endsWith( '.themex' ) ) {
            return {
                project:  <gi.bundle.project>  importFileObject( fileType.project, file ),
                settings: <gi.bundle.settings> importFileObject( fileType.settings, file )
            }
        } else {
            return undefined;
        }
    }

//
// ─── IMPORT FILE ────────────────────────────────────────────────────────────────
//

    function importFileObject ( kind: fileType, cwd: string ): Object {
        let address: string;
        if ( kind == fileType.project ) {
            address = path.join( cwd, 'theme.yml' );
        } else {
            address = path.join( cwd, 'project.yml')
        }
        console.log( address );
        return importYAML( address );
    }

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