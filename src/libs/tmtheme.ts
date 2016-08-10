
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

    const pListHead = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>`;

//
// ─── TM THEME GENERATOR ─────────────────────────────────────────────────────────
//

    export = ( currentTheme: themeX.ICurrentTheme ): string => {
        theme = currentTheme;
        return generateTheme( );
    }

//
// ─── GENERATE THEME ─────────────────────────────────────────────────────────────
//

    function generateTheme ( ): string {
        // adding header
        let themeXML: string[ ] = [ ];

        // adding the name
        themeXML.push(
            addPListKeyInline( 'name', theme.theme.project.themes[ theme.index ].name ) );

        // adding the main buddy
        themeXML.push( generateTmThemeSettingsArray( ) );

        // adding the main settings
        themeXML.push( generateTmThemeSettings( ) );

        // finalizing...
        return `${ pListHead }${ themeX.indent( themeXML.join('') ) }\n</dict>\n</plist>`;
    }

//
// ─── GENERATE TM THEME SETTINGS ARRAY ───────────────────────────────────────────
//

    function generateTmThemeSettingsArray ( ): string {
        let settings: string[ ] = [ ];
        // main settings
        settings.push( generateMainColorSchemeSettings( ) );

        // comment...
        let commentRule: themeX.IBundle.rule = {
            color:  themeX.parseColor(
                        theme,
                        theme.theme.project.themes[ theme.index ].settings.comment
            ),
            scope:  'comment',
            name:   'Comment'
        }
        settings.push( generateRuleXML( commentRule ) );

        // rest of the rules
        theme.theme.project.rules.forEach( rule => {
            settings.push( generateRuleXML( rule ) );
        });

        // done
        return addPListSettingsArray( settings );
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
        
        addSettingColor( 'background'   , settings.background     );
        addSettingColor( 'foreground'   , settings.foreground     );
        addSettingColor( 'caret'        , settings.caret          );
        addSettingColor( 'invisibles'   , settings.invisibles     );
        addSettingColor( 'lineHighlight', settings.lineHighlight  );
        addSettingColor( 'selection'    , settings.selection      );

        return `\n<!-- Main Color Settings -->${ addPListKeyBlock( 'settings', result.join('') ) }`;
    }

//
// ─── GENERATE RULE ───────────────────────────────────────────────────────────────
//

    function generateRuleXML ( rule: themeX.IBundle.rule ): string {
        // init name
        let result = [ addPListKeyInline( 'name', rule.name ) ];

        // adding the scope
        if ( rule.scope !== null && rule.scope !== undefined ) {
            result.push( addPListKeyInline( 'scope', rule.scope ) );
        } else if ( rule.scopes !== null && rule.scopes !== undefined ) {
            result.push( addPListKeyInline('scope', rule.scopes.join(', ') ) );
        } else {
            themeX.report( `bad scope definition: "${ rule.name }".`)
            return '';
        }

        // adding the color
        let settings: string[ ] = [
            addPListKeyInline('foreground', themeX.parseColor( theme, rule.color ) )
        ];

        // adding style info
        let styleSettings = '';
        [ 'bold', 'italic', 'underline' ].forEach( style => {
            if ( rule[ style ] === true ) {
                styleSettings = `${ styleSettings } ${ style }`;
            }
        });
        if ( styleSettings !== '' ) {
            settings.push(
                addPListKeyInline( 'fontStyle', styleSettings )
            )
        }

        // configuring settings
        result.push(
            addPListKeyBlock('settings',
                settings.join('')
        ));

        // done
        return result.join('');
    }

//
// ─── MAKE P LIST SETTINGS ───────────────────────────────────────────────────────
//

    function generateTmThemeSettings ( ): string {
        let settingsXML = '\n<!-- Theme Settings -->';

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
        return `\n<key>${ key }</key>\n<dict>${ themeX.indent( text ) }\n</dict>`;
    }

//
// ─── ADD P LIST DICT BLOCK ──────────────────────────────────────────────────────
//

    function addPListSettingsArray ( array: string[ ] ) {
        let result = array.map( dict => {
            return `\n<dict>${ themeX.indent( dict ) }\n</dict>`;
        });
        return `\n<key>settings</key>\n<array>${ themeX.indent( result.join('') ) }\n</array>`;
    }

// ────────────────────────────────────────────────────────────────────────────────