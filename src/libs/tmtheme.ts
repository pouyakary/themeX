
//
// Theme - A general color scheme theme generator
//  Copyright 2016 Kary Foundation, Inc. All Rights Reserved.
//  Authored by Pouya Kary <k@karyfoundation.org>
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import themeX = require('../themeX');

//
// ─── GLOBALS ────────────────────────────────────────────────────────────────────
//

    var theme: themeX.ICurrentTheme;

//
// ─── DEFS ───────────────────────────────────────────────────────────────────────
//

    const pListHead = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">`;

//
// ─── TM THEME GENERATOR ─────────────────────────────────────────────────────────
//

    export = ( currentTheme: themeX.ICurrentTheme ) => {
        theme = currentTheme;
        console.log( generateTmThemeSettings( ) );
        console.log( themeX.parseColor( theme, '.red' ) );
    }

//
// ─── GENERATE MAIN COLOR SETTINGS ───────────────────────────────────────────────
//

    function generateMainColorSchemeSettings ( currentTheme: themeX.ICurrentTheme ) {
        let settings = currentTheme.theme.project.themes[ currentTheme.index ].settings;
        let resultingTheme = '';
        resultingTheme += addPListKey('caret', settings.caret );
    }

//
// ─── ADD COLOR ──────────────────────────────────────────────────────────────────
//

    function addSettingColor ( currentTheme ) {

    }

//
// ─── MAKE P LIST SETTINGS ───────────────────────────────────────────────────────
//

    function generateTmThemeSettings ( ): string {
        let settingsXML = '<!-- Theme Settings -->';

        settingsXML += addPListKey( 'uuid',
            theme.theme.project.themes[ theme.index ].uuid );

        settingsXML += addPListKey( 'semanticClass',
            `theme.${ theme.theme.project.themes[ theme.index ].baseColor }.${ theme.theme.project.themes[ theme.index ].uuid }`);

        settingsXML += addPListKey( 'author', theme.theme.project.author );

        settingsXML += addPListKey( 'colorSpaceName', 'sRGB' );

        return settingsXML;
    }

//
// ─── P LIST ADD KEY ─────────────────────────────────────────────────────────────
//

    function addPListKey ( key: string, text: string ): string {
        return `\n<key>${ key }</key>\n<string>${ text }</string>`;
    }

// ────────────────────────────────────────────────────────────────────────────────