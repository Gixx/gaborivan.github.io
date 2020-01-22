require('./components/Util');
require('./components/Cookie');
require('./components/LazyLoadImage');

document.addEventListener('DOMContentLoaded', function () {
    Util.init();
});

document.addEventListener('Component.Util.Ready', function () {
    Cookie.init();
    LazyLoadImage.init();
});
