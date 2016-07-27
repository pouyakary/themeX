
//
// Theme - A general color scheme theme generator
//  Copyright 2016 Kary Foundation, Inc. All Rights Reserved.
//  Authored by Pouya Kary <k@karyfoundation.org>
//

//
// ─── IMPORTS ────────────────────────────────────────────────────────────────────
//

    import check = require('./checkcore');
    import gi    = require('./interfaces');

//
// ─── BUILD ──────────────────────────────────────────────────────────────────────
//

    export = ( project: gi.bundle.base ): boolean => {
        if ( !check( project ) ) return false;
        applyBuild( project );
    }

//
// ─── APPLY BUILD TO PROJECT ─────────────────────────────────────────────────────
//

    function applyBuild( project: gi.bundle.base ) {
        
    }

// ────────────────────────────────────────────────────────────────────────────────