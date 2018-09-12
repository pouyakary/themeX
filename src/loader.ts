
//
// Copyright 2016-present by Pouya Kary <kary@gnu.org> All rights reserved
//

//
// ─── LOADINGS ───────────────────────────────────────────────────────────────────
//

    import * as themeX  from './themeX'
    import * as jsYaml  from 'js-yaml'
    import * as fs      from 'fs'
    import * as path    from 'path'

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
        return loadProjectByFile( process.cwd( ) )
    }

//
// ─── LOAD BY CURRENT WORKING DIRECTORY ──────────────────────────────────────────
//

    /** Loads the project main yaml file */
    export function loadProjectByFile ( file: string ): themeX.IBundle.base {
        if ( file.toLowerCase( ).endsWith( '.themex' ) ) {
            themeX.print( 'parsing theme files' )
            return {
                project: <themeX.IBundle.project> importFileObject(
                    fileType.project, file ),
                settings: <themeX.IBundle.settings>importFileObject(
                    fileType.settings, file ),
                path: file
            }
        } else {
            return undefined
        }
    }

//
// ─── IMPORT FILE ────────────────────────────────────────────────────────────────
//

    function importFileObject ( kind: fileType, cwd: string ): Object {
        const address =
            (( kind == fileType.project )
                ? path.join( cwd, 'theme.yml' )
                : path.join( cwd, 'project.yml' )
                )

        return importYAML( address )
    }

//
// ─── IMPORT YAML ────────────────────────────────────────────────────────────────
//

    function importYAML ( address: string ): Object {
        if ( fs.existsSync( address ) ) {
            const fileString = fs.readFileSync( address, 'utf8' )
            const decodedObject = jsYaml.load( fileString )
            return decodedObject
        } else {
            return null
        }
    }

// ────────────────────────────────────────────────────────────────────────────────

