/**
 * Lazy Load Image component
 *
 * @type {{init: LazyLoadImage.init, getLazyLoadImages: (function(): NodeList)}}
 */
const LazyLoadImage = function ({verbose = false}) {
    /** @type {boolean} */
    let initialized = false;
    /** @type {NodeList} */
    let lazyLoadImages;
    /** @type {number} */
    let idCounter = 1;
    /** @type {string} */
    let consoleColorId = '#BFFFF5';
    /** @type IntersectionObserver */
    let imageObserver;

    if (typeof Util === 'undefined') {
        throw new ReferenceError('This component requires the Util component to be loaded.');
    }

    /**
     * Adds lazy-load behaviour to an image element.
     *
     * @param {HTMLImageElement|Node} HTMLElement
     * @returns {*}
     * @constructor
     */
    let LazyLoadImageElement = function ({HTMLElement}) {
        verbose && console.info(
            '%c[Lazy Load Image]%c ✚%c an image element initialized %o',
            'background:'+consoleColorId+';font-weight:bold;',
            'color:green; font-weight:bold;',
            'color:black;',
            '#'+HTMLElement.getAttribute('id')
        );


        return {
            constructor: LazyLoadImageElement,

            /**
             * Loads the actual image when it gets into view
             */
            loadImage: function () {
                if (!HTMLElement.hasAttribute('data-src')) {
                    return;
                }
                let imageSource = HTMLElement.dataset.src;
                let preload  = new Image();

                preload.addEventListener('error', function (event) {
                    event.preventDefault();
                    verbose && console.info(
                        '%c[Lazy Load Image]%c ✖%c an image resource is not found %c'+imageSource,
                        'background:'+consoleColorId+';font-weight:bold;',
                        'color:red',
                        'color:#599bd6',
                        'color:black;font-style:italic'
                    );
                });

                preload.addEventListener('load', function () {
                    HTMLElement.src = imageSource;
                    HTMLElement.removeAttribute('data-src');

                    verbose && console.info(
                        '%c[Lazy Load Image]%c ⚡%c an image element loaded %o',
                        'background:'+consoleColorId+';font-weight:bold;',
                        'color:orange;font-weight:bold',
                        'color:#599bd6',
                        '#'+HTMLElement.getAttribute('id')
                    );
                });

                preload.src = imageSource;
            }
        }
    };

    verbose && console.info(
        '%c[Lazy Load Image]%c ✔%c The Lazy Load Image component loaded.',
        'background:'+consoleColorId+';font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:black; font-weight:bold;'
    );

    return {
        /**
         * Initializes the loader and collects the elements.
         */
        init : function () {
            if (initialized) {
                return;
            }

            verbose && console.info(
                '%c[Lazy Load Image]%c ...looking for image elements.',
                'background:'+consoleColorId+';font-weight:bold;',
                'color:#cecece'
            );

            imageObserver = new IntersectionObserver((entries, imgObserver) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        /** @type LazyLoadImageElement lazyLoadImageElement */
                        let lazyLoadImageElement = entry.target.component;
                        lazyLoadImageElement.loadImage();
                    }
                })
            });

            lazyLoadImages = document.querySelectorAll('img[data-src]');

            lazyLoadImages.forEach(function (element) {
                if (!element.hasAttribute('id')) {
                    element.setAttribute('id', 'lazyImage' + (idCounter++));
                }

                element.component = new LazyLoadImageElement({HTMLElement: element});
                imageObserver.observe(element);
            });

            Util.triggerEvent({element: document, eventName: 'Component.LazyLoadImage.Ready'});
            initialized = true;
        },

        /**
         * Returns the collection of lazy-loaded images.
         *
         * @returns {NodeList}
         */
        getLazyLoadImages: function () {
            return lazyLoadImages;
        }
    };
}({verbose: true});

window['LazyLoadImage'] = LazyLoadImage;
