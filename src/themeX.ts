
//
// Theme - A general color scheme theme generator
//  Copyright 2016 Kary Foundation, Inc. All Rights Reserved.
//  Authored by Pouya Kary <k@karyfoundation.org>
//

//
// ─── REPORTER ───────────────────────────────────────────────────────────────────
//

    export function report ( errorNumber: number, errorMessage: string ) {
        console.log(`-> themeX E${ errorNumber }: ${ errorMessage }`);
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

// ────────────────────────────────────────────────────────────────────────────────




        //
        // ─── PROJECT SETTINGS ────────────────────────────────────────────
        //

            export interface settings {

            }

        // ─────────────────────────────────────────────────────────────────





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
