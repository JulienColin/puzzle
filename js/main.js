require.config({
    shim: {
        'underscore': {
            exports: '_'
        },
        'handlebars': {
            exports: 'Handlebars'
        }
    },

    paths: {
        'jquery': 'libs/vendor/jquery-2.1.0.min',
        'underscore': 'libs/vendor/underscore-min',
        'handlebars': 'libs/vendor/handlebars-v1.3.0',
        'hbsCustomHelpers': 'libs/handlebars-custom-helpers',
        'text': 'libs/vendor/text',
        'hbs': 'libs/require-handlebars',
        'helpers' : 'libs/helpers',
        'puzzleproto': 'libs/puzzle-proto'
    }
});

// Quel fichier de configuration ?
var bootstrapScript = document.querySelector("#bootstrap");
var puzzleConf = "config.json";
if(bootstrapScript.hasAttribute("data-conf")) {
    puzzleConf = bootstrapScript.getAttribute("data-conf") + ".json";
}

// bootstrap app
require([],function() {
    require(["app"]);
});
