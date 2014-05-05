require.config({
    paths: {
        'domReady': 'lib/require-domReady/domReady'
    }
});
require(['app'], function(app) {
    app.run();
});