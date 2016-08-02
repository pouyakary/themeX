
//
// Theme - A general color scheme theme generator
//  Copyright 2016 Kary Foundation, Inc. All Rights Reserved.
//  Authored by Pouya Kary <k@karyfoundation.org>
//

//
// ─── INCLUDES ───────────────────────────────────────────────────────────────────
//

    import themeX   = require('../../themeX');
    import tmTheme  = require('../../libs/tmTheme');
    import fs       = require('fs-extra');
    import path     = require('path');

//
// ─── PACKAGE INFORMATION ────────────────────────────────────────────────────────
//

    export const id         = 'org.karyfoundation.themeX.sublime';
    export const editorName = 'Sublime Text';
    export const editorId   = 'sublime';
    export const version    = '1.0.0';
    export const author     = 'Kary Foundation, Inc.';

//
// ─── BUILDING FOR SUBLIME TEXT ──────────────────────────────────────────────────
//

    export function generate ( project: themeX.IBundle.base, address: string ) {
        let sublimeBuildDir = themeX.adaptorBuildDirectoryPath( this, address );
        themeX.forEachThemeDo( project, address, theme => {
            createSublimeThemeFiles( theme, sublimeBuildDir );
        });
    }

//
// ─── CREATING FILES FOR SUBLIME ─────────────────────────────────────────────────
//

    function createSublimeThemeFiles ( theme: themeX.ICurrentTheme, dir: string ) {
        let themeCode = tmTheme( theme );
        let fileName = `${ themeX.getFileNameForTheme( theme ) }.tmTheme`;
        fs.writeFile( path.join( dir , fileName ), themeCode, error => {
            if ( error ) {
                themeX.report(`could not build: ${ fileName }`);
            }
        });
    }

// ────────────────────────────────────────────────────────────────────────────────