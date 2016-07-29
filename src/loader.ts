
//
// Theme - A general color scheme theme generator
//  Copyright 2016 Kary Foundation, Inc. All Rights Reserved.
//  Authored by Pouya Kary <k@karyfoundation.org>
//

//
// ─── LOADINGS ───────────────────────────────────────────────────────────────────
//

    import themeX   = require('./themeX');
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
    export function loadProjectByFile ( file: string ): themeX.IBundle.base {
        if ( file.toLowerCase( ).endsWith( '.themex' ) ) {
            themeX.print('parsing the theme files.');
            return {
                project: <themeX.IBundle.project>  importFileObject(
                    fileType.project, file ),
                settings: <themeX.IBundle.settings> importFileObject(
                    fileType.settings, file ),
                path: file
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