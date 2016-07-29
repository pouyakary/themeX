
//
// Theme - A general color scheme theme generator
//  Copyright 2016 Kary Foundation, Inc. All Rights Reserved.
//  Authored by Pouya Kary <k@karyfoundation.org>
//

//
// ─── GET VARIABLE ───────────────────────────────────────────────────────────────
//

    export function parseColor ( theme: ICurrentTheme, color: string ): string {
        function onBadColor ( ) {
            if ( theme.theme.project.themes[ theme.index ].baseColor === 'dark' ) {
                return '#FFFFFF';
            } else {
                return '#000000';
            }
        }

        if ( /^\#?[A-F0-9]{6}$/i.test( color ) ) {
            if ( color.startsWith('#') ) {
                return color.toUpperCase( );
            } else {
                return `#${color.toUpperCase( ) }`;
            }
        } else if ( /^\.[a-z]([a-z0-9\-]*[a-z0-9])?$/i.test( color ) ) {
            let v = theme.theme.project.themes[ theme.index ].colors[ color.substr( 1 ) ];
            if ( v !== undefined || v !== null ) {
                return `#${ v.toUpperCase( ) }`;
            } else {
                onBadColor( );
            }
        }
        return onBadColor( );
    }

//
// ─── REPORTER ───────────────────────────────────────────────────────────────────
//

    export function report ( errorNumber: number, errorMessage: string ) {
        console.log(`-> themeX E${ errorNumber }: ${ errorMessage }`);
    }

//
// ─── INDENT ─────────────────────────────────────────────────────────────────────
//

    /** Indents the string... */
    export function indent ( text: string ) {
        return text.split('\n').map( line => '    ' + line ).join('\n');
    }

//
// ─── CURRENT THEME ──────────────────────────────────────────────────────────────
//

    export interface ICurrentTheme {
        theme: IBundle.base;
        index: number;
    }

//
// ─── BUNDLE INTERFACE ───────────────────────────────────────────────────────────
//

    export module IBundle {

        //
        // ─── MAIN THEMEX PROJECT ─────────────────────────────────────────
        //

            export interface project {
                /** Version of theme */
                version: string;

                /** Description of the theme */
                description: string;

                /** Author of the theme */
                author: string;

                /** Colorspace name */
                colorSpaceName?: string;

                /** Theme plates */
                themes: theme[ ];

                /** Rules of the theme */
                rules: rule[ ];
            }

        //
        // ─── THEME INTERFACE ─────────────────────────────────────────────
        //

            export interface theme {
                /** Theme name */
                name: string;

                /** UUID */
                uuid: string;

                /** BaseColor, is it dark or light */
                baseColor: string;

                /** Base color settings for the color */
                settings: themeSettings;

                /** Colors of the theme */
                colors: Object;
            }

        //
        // ─── THEME SETTINGS ──────────────────────────────────────────────
        //

            export interface themeSettings {
                background: string;
                caret: string;
                foreground: string;
                invisibles: string;
                lineHighlight: string;
                selection: string;
                comment: string;
            }

        //
        // ─── THEME RULES ─────────────────────────────────────────────────
        //

            export interface rule {
                name: string;
                scope?: string;
                scopes?: string[ ];
                color: string;
            }

        //
        // ─── PROJECT SETTINGS ────────────────────────────────────────────
        //

            export interface settings {

            }

        //
        // ─── PROJECT OBJECT ──────────────────────────────────────────────
        //

            export interface base {
                project: project;
                settings: settings;
            }

        // ─────────────────────────────────────────────────────────────────

    }

// ────────────────────────────────────────────────────────────────────────────────
