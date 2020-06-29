/**
 * Lazy Load Image component.
 *
 * @param {object} utility
 * @param {boolean} verbose
 * @returns {*}
 */
const LazyLoadImage = function ({utility, verbose = false})
{
    /** @type {NodeList} */
    let lazyLoadImages;
    /** @type {number} */
    let idCounter = 1;
    /** @type {string} */
    const consoleColorId = '#BFFFF5';
    /** @type {IntersectionObserver|IntersectionObserverFallback} */
    let imageObserver;

    if (!utility instanceof Utility) {
        throw new ReferenceError('This component requires the Utility component to be loaded.');
    }

    const IntersectionObserverFallback = function() {
        verbose && console.info(
            '%c[Lazy Load Image]%c ✖%c the IntersectionObserver function is not supported. Loading images in normal mode.',
            'background:'+consoleColorId+';color:black;font-weight:bold;',
            'color:red',
            'color:#599bd6;font-style:italic'
        );

        return {
            observe: function (element) {
                element.src = element.dataset.src;

                verbose && console.info(
                    '%c[Lazy Load Image]%c ⚡%c an image element loaded %o',
                    'background:'+consoleColorId+';color:black;font-weight:bold;',
                    'color:orange;font-weight:bold',
                    'color:#599bd6;font-style:italic',
                    '#'+element.getAttribute('id')
                );
            }
        }
    };

    const intersectionObserverClass = typeof IntersectionObserver !== 'undefined'
        ? IntersectionObserver
        : IntersectionObserverFallback;

    /**
     * Adds lazy-load behaviour to an image element.
     *
     * @param {HTMLImageElement|Node} HTMLElement
     * @returns {*}
     */
    const LazyLoadImageElement = function ({HTMLElement}) {
        verbose && console.info(
            '%c[Lazy Load Image]%c ✚%c an image element initialized %o',
            'background:'+consoleColorId+';color:black;font-weight:bold;',
            'color:green; font-weight:bold;',
            'color:#599bd6;font-style:italic',
            '#'+HTMLElement.getAttribute('id')
        );

        return {
            /**
             * Loads the actual image when it gets into view
             */
            loadImage: function () {
                if (!HTMLElement.hasAttribute('data-src')) {
                    return;
                }
                const imageSource = HTMLElement.dataset.src;
                const preload  = new Image();

                preload.addEventListener('error', function (event) {
                    event.preventDefault();
                    verbose && console.info(
                        '%c[Lazy Load Image]%c ✖%c an image resource is not found: %c'+imageSource,
                        'background:'+consoleColorId+';color:black;font-weight:bold;',
                        'color:red',
                        'color:#599bd6;font-style:italic',
                        'color:red;font-style:italic'
                    );
                });

                preload.addEventListener('load', function () {
                    HTMLElement.src = imageSource;
                    HTMLElement.removeAttribute('data-src');

                    verbose && console.info(
                        '%c[Lazy Load Image]%c ⚡%c an image element loaded %o',
                        'background:'+consoleColorId+';color:black;font-weight:bold;',
                        'color:orange;font-weight:bold',
                        'color:#599bd6;font-style:italic',
                        '#'+HTMLElement.getAttribute('id')
                    );
                });

                preload.src = imageSource;
            }
        }
    };

    /**
     * Initializes the loader and collects the elements.
     */
    const initialize = function()
    {
        verbose && console.info(
            '%c[Lazy Load Image]%c ...looking for image elements.',
            'background:'+consoleColorId+';color:black;font-weight:bold;',
            'color:#599bd6;font-style:italic'
        );

        lazyLoadImages = document.querySelectorAll('img[data-src]');

        imageObserver = new intersectionObserverClass((entries, imgObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    /** @type LazyLoadImageElement lazyLoadImageElement */
                    let lazyLoadImageElement = entry.target.component;
                    lazyLoadImageElement.loadImage();
                }
            })
        });

        lazyLoadImages.forEach(function (element) {
            if (!element.hasAttribute('id')) {
                element.setAttribute('id', 'lazyImage' + (idCounter++));
            }

            element.component = new LazyLoadImageElement({HTMLElement: element});
            imageObserver.observe(element);
        });

        utility.triggerEvent({element: document, eventName: 'Component.LazyLoadImage.Ready'});
    };

    verbose && console.info(
        '%c[Lazy Load Image]%c ✔%c The Lazy Load Image component loaded.',
        'background:'+consoleColorId+';color:black;font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:#599bd6; font-weight:bold;'
    );

    initialize();

    return {
        /**
         * Returns the collection of lazy-loaded images.
         *
         * @returns {NodeList}
         */
        getLazyLoadImages: function () {
            return lazyLoadImages;
        }
    };
};

window['LazyLoadImage'] = LazyLoadImage;
