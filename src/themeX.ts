
//
// Theme - A general color scheme theme generator
//  Copyright 2016 Kary Foundation, Inc. All Rights Reserved.
//  Authored by Pouya Kary <k@karyfoundation.org>
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import fs       = require('fs-extra');
    import colors   = require('colors');
    import path     = require('path');

// ────────────────────────────────────────────────────────────────────────────────





//
// ────────────────────────────────────────────────────── I ──────────
//   :::::: T O O L I N G : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────
//

//
// ─── FOR EACH KEY DO ────────────────────────────────────────────────────────────
//

    export function forkey ( object: Object, func: ( key: string ) => void ) {
        Object.keys( object ).forEach( key => {
            func( key );
        });
    }

//
// ─── ENCODE THEME NAME TO FILE NAME ─────────────────────────────────────────────
//

    export function getFileNameForTheme ( theme: ICurrentTheme ) {
        let name = theme.theme.project.themes[ theme.index ].name;
        return name.toLocaleLowerCase( ).replace( / /g, '' );
    }

//
// ─── BUILD PROJECT PATH ─────────────────────────────────────────────────────────
//

    export function buildsDirectoryPath ( address: string ): string {
        return path.join( getFolderContainingProject( address ), path.join( 'builds' ) );
    }

// 
// ─── GET BUILD DIR ──────────────────────────────────────────────────────────────
//

    export function adaptorBuildDirectoryPath ( adaptor: IAdaptor,
                                                address: string ): string {
        return path.join( buildsDirectoryPath( address ), adaptor.editorId );
    }

//
// ─── GET FOLDER CONTAINING THE PROJECT ──────────────────────────────────────────
//

    export function getFolderContainingProject ( address: string ): string {
        return address.replace( /\/(?:[^(\/)\\]|\\.)*$/, '' );
    }

//
// ─── FOR EACH PROJECT DO ────────────────────────────────────────────────────────
//

    export function forEachThemeDo ( project: IBundle.base,
                                     address: string,
                           generatorFunction: ( theme: ICurrentTheme ) => void ) {
        for ( let __INDEX = 0; __INDEX < project.project.themes.length; __INDEX++ ) {
            generatorFunction({
                theme: project,
                index: __INDEX,
                 path: address
            });
        }
    }

//
// ─── GET VARIABLE ───────────────────────────────────────────────────────────────
//

    export function parseColor ( theme: ICurrentTheme, color: string ): string {
        color = color.toString( );

        function onBadColor ( ) {
            return ( theme.theme.project.themes[ theme.index ].baseColor === 'dark' )? '#FFFFFF' : '#000000';
        }

        if ( /^\#?[A-F0-9]{6}$/i.test( color ) ) {
            return color.toString( ).startsWith('#')? color.toUpperCase( ) : `#${ color.toUpperCase( ) }`;
        } else if ( /^\.[a-z]([a-z0-9\-]*[a-z0-9])?$/i.test( color ) ) {
            let v = theme.theme.project.themes[ theme.index ].colors[ color.substr( 1 ) ];
            return v? `#${ v.toUpperCase( ) }` : onBadColor( );
        }
        return onBadColor( );
    }

//
// ─── REPORTER ───────────────────────────────────────────────────────────────────
//

    export function report ( errorMessage: string ): void {
        console.log(` ${ colors.red('✕') } ${ errorMessage}\n`);
    }

//
// ─── THEMEX LOG ─────────────────────────────────────────────────────────────────
//

    export function print ( input: any ): void {
        console.log(` ${ colors.green('✓') } ${ input }\n`);
    }

//
// ─── INDENT ─────────────────────────────────────────────────────────────────────
//

    /** Indents the string... */
    export function indent ( text: string ): string {
        return text.split('\n').map( line => '    ' + line ).join('\n');
    }

// ────────────────────────────────────────────────────────────────────────────────





//
// ──────────────────────────────────────────────────────────── II ──────────
//   :::::: I N T E R F A C E S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────
//

//
// ─── INTERFACES ─────────────────────────────────────────────────────────────────
//

    export interface IAdaptor {
        name: string;
        adaptorPath: string;
        id: string;
        generate ( project: IBundle.base, address: string );
        editorName: string;
        editorId: string;
        version: string;
        author: string;
    }

//
// ─── CURRENT THEME ──────────────────────────────────────────────────────────────
//

    export interface ICurrentTheme {
        theme: IBundle.base;
        index: number;
        path: string;
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
                bold?: boolean;
                italic?: boolean;
                underline?: boolean;
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
                path: string;
            }

        // ─────────────────────────────────────────────────────────────────

    }

// ────────────────────────────────────────────────────────────────────────────────




//
// ──────────────────────────────────────────────── III ──────────
//   :::::: F I L E : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────
//

//
// ─── REPLACE OBJECTS IN STRING ──────────────────────────────────────────────────
//

    /** Replaces some objects keys with their values in a text */
    export function replaceObjectsInString ( text: string, replacements: Object ) {
        text.replace( /\{\#[a-b\_0-9 ]+\#\}/gi, ( handle: string ) => {
            console.log( handle );
            return null;
        });
    }

//
// ─── COPY TOOL ──────────────────────────────────────────────────────────────────
//

    /**
     * Let's you copy a **_template file_** from templates directory to the build
     * **_destination folder_** by also replacing your _replacements_ (optional)
     */
    export function copy ( adaptor: IAdaptor,
                          template: string,
                       destination: string,
                     replacements?: Object ): boolean {

        // loading the file
        let fileContent = fs.readFileSync( template, 'utf8' );
        if ( fileContent === null || fileContent === undefined ) return false;

    }

// ────────────────────────────────────────────────────────────────────────────────