
//
// Theme - A general color scheme theme generator
//  Copyright 2016 Kary Foundation, Inc. All Rights Reserved.
//  Authored by Pouya Kary <k@karyfoundation.org>
//

//
// ─── MAIN THEME X PROJECT ───────────────────────────────────────────────────────
//

    export interface IThemeXProject {
        /** Version of theme */
        version: string;

        /** Description of the theme */
        description: string;

        /** Author of the theme */
        author: string;

        /** Theme plates */
        themes: IThemeXTheme[ ];

        /** Rules of the theme */
        rules: IThemeXRule[ ];
    }

//
// ─── THEME INTERFACE ────────────────────────────────────────────────────────────
//

    export interface IThemeXTheme {
        /** Theme name */
        name: string;

        /** UUID */
        uuid: string;

        /** Base color settings for the color */
        settings: IThemeXThemeSettings;

        /** Colors of the theme */
        colors: Object;
    }

//
// ─── THEME SETTINGS ─────────────────────────────────────────────────────────────
//

    export interface IThemeXThemeSettings {
        background: string;
        caret: string;
        foreground: string;
        invisibles: string;
        lineHighlight: string;
        selection: string;
        comment: string;
    }

//
// ─── THEME RULES ────────────────────────────────────────────────────────────────
//

    export interface IThemeXRule {
        name: string;
        scope?: string;
        scopes?: string[ ];
        color: string;
    }

// ────────────────────────────────────────────────────────────────────────────────