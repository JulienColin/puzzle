/* Handlebars Custom Helpers collection */
define(['module', 'handlebars'], function (module, Handlebars) {
    /**
     * This helper provides a if inline comparing two values.
     *
     * Copyright RestHub
     */
    Handlebars.registerHelper('ifequalsinline', function (value1, value2, returnValTrue, options) {
        var returnValFalse = '';
        if (arguments.length == 5) {
            returnValFalse = options
        }
        return (value1 === value2) ? returnValTrue : returnValFalse;
    });

    return Handlebars;
});
