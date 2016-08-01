
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

//
// ─── PACKAGE INFORMATION ────────────────────────────────────────────────────────
//

    export const id         = 'org.karyfoundation.themeX.sublime';
    export const editorName = 'Sublime Text';
    export const editorId   = 'sublime'
    export const version    = '1.0.0'
    export const author     = 'Kary Foundation, Inc.';

//
// ─── BUILDING FOR SUBLIME TEXT ──────────────────────────────────────────────────
//

    export function generate ( project: themeX.IBundle.base, address: string ) {
        themeX.forEachThemeDo( project, address, theme => {
            
        });
    }

//
// ─── CREATE BASE FOLDER ─────────────────────────────────────────────────────────
//

// ────────────────────────────────────────────────────────────────────────────────