

//
// vscode - A general color scheme theme generator
//  Copyright 2016 Kary Foundation, Inc. All Rights Reserved.
//  Authored by Pouya Kary <k@karyfoundation.org>
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import themeX = require( '../../themeX' );
    import tmTheme = require( '../../libs/tmTheme' );
    import fs = require( 'fs' );
    import path = require( 'path' );

//
// ─── PACKAGE INFORMATION ────────────────────────────────────────────────────────
//

    export const id = 'org.karyfoundation.themeX.vscode';
    export const editorName = 'Visual Studio Code';
    export const editorId = 'sublime'
    export const version = '1.0.0'
    export const name = 'Visual Studio Code ThemeX Generator';
    export const author = 'Kary Foundation, Inc.';

//
// ─── BUILDER FOR VISUAL STUDIO CODE ─────────────────────────────────────────────
//

    export function generate ( project: themeX.IBundle.base, address: string ) {
        let currentTheme: themeX.ICurrentTheme = {
            theme: project,
            index: 0,
            path: address
        }
    }

//
// ─── GENERATE THEME ─────────────────────────────────────────────────────────────
//

    function generateTheme ( theme: themeX.ICurrentTheme ) {
        let file = fs.readFileSync(
            `${this.adaptorPath}/templates/package.json`, 'utf8' );
        return themeX.replaceObjectsInString( file, {
            name: 'hello-world-this-is-some-kind-of-crap'
        });
    }

// ────────────────────────────────────────────────────────────────────────────────

    