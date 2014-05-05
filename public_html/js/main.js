require.config({
    paths: {
        'domReady': 'libs/require-domReady/domReady'
    }
});
require(['app'], function(app) {
    app.run();
});