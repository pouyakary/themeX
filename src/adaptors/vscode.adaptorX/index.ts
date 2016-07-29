

//
// vscode - A general color scheme theme generator
//  Copyright 2016 Kary Foundation, Inc. All Rights Reserved.
//  Authored by Pouya Kary <k@karyfoundation.org>
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import themeX  = require( '../../themeX' );
    import tmTheme = require( '../../libs/tmTheme' );

//
// ─── PACKAGE INFORMATION ────────────────────────────────────────────────────────
//

    export const id         = 'org.karyfoundation.themeX.vscode';
    export const editor     = 'Visual Studio Code';
    export const version    = '1.0.0'
    export const name       = 'Visual Studio Code ThemeX Generator';
    export const author     = 'Kary Foundation, Inc.';

//
// ─── BUILDER FOR VISUAL STUDIO CODE ─────────────────────────────────────────────
//

    export function generate ( project: themeX.IBundle.base ) {
        let currentTheme: themeX.ICurrentTheme = {
            theme: project,
            index: 0
        }
        console.log( tmTheme( currentTheme ) );
    }

// ────────────────────────────────────────────────────────────────────────────────