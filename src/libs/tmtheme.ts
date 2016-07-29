
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
        console.log( generateMainColorSchemeSettings( ) );
    }

//
// ─── GENERATE MAIN COLOR SETTINGS ───────────────────────────────────────────────
//

    function generateMainColorSchemeSettings ( ) {
        let settings = theme.theme.project.themes[ theme.index ].settings;
        let result: string[ ] = [  ];

        function addSettingColor ( name: string, color: string ) {
            result.push( addPListKeyInline( name, themeX.parseColor( theme, color ) ) );
        }
        
        addSettingColor( 'background',      settings.background     );
        addSettingColor( 'foreground',      settings.foreground     );
        addSettingColor( 'caret',           settings.caret          );
        addSettingColor( 'invisibles',      settings.invisibles     );
        addSettingColor( 'lineHighlight',   settings.lineHighlight  );
        addSettingColor( 'selection',       settings.selection      );

        let insideCode = result.join('');
        return `<!-- Main Color Settings -->${ addPListKeyBlock( 'settings', result.join('') )}`;
    }

//
// ─── MAKE P LIST SETTINGS ───────────────────────────────────────────────────────
//

    function generateTmThemeSettings ( ): string {
        let settingsXML = '<!-- Theme Settings -->';

        settingsXML += addPListKeyInline( 'uuid',
            theme.theme.project.themes[ theme.index ].uuid );

        settingsXML += addPListKeyInline( 'semanticClass',
            `theme.${ theme.theme.project.themes[ theme.index ].baseColor }.${ theme.theme.project.themes[ theme.index ].uuid }`);

        settingsXML += addPListKeyInline( 'author', theme.theme.project.author );

        settingsXML += addPListKeyInline( 'colorSpaceName', 'sRGB' );

        return settingsXML;
    }

//
// ─── P LIST ADD KEY ─────────────────────────────────────────────────────────────
//

    function addPListKeyInline ( key: string, text: string ): string {
        return `\n<key>${ key }</key>\n<string>${ text }</string>`;
    }

//
// ─── ADD P LIST BLACK ───────────────────────────────────────────────────────────
//

    function addPListKeyBlock ( key: string, text: string ): string {
        return `\n<key>${ key }</key>\n<string>${ themeX.indent( text ) }\n</string>`;
    }

// ────────────────────────────────────────────────────────────────────────────────