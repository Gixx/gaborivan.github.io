/**
 * SmoothScroll component.
 * @param {object} utility
 * @param {boolean} verbose
 * @returns {*}
 */
const SmoothScroll = function ({utility, verbose = false})
{
    /** @type {string} */
    const consoleColorId = '#c96352';

    if (!utility instanceof Utility) {
        throw new ReferenceError('This component requires the Utility component to be loaded.');
    }

    /**
     * Return the actual scroll position in pixels.
     *
     * @return {number}
     */
    const getScrollPosition = function () {
        return window.pageYOffset;
    };

    /**
     * Return the client height in pixels.
     *
     * @return {number}
     */
    const getClientHeight = function () {
        return document.documentElement.clientHeight;
    }

    /**
     * Return the document height in pixels.
     *
     * @return {number}
     */
    const getDocumentHeight = function () {
        return document.body.offsetHeight;
    }

    /**
     * Return the maximum scroll position available in pixels.
     * @return {number}
     */
    const getMaxScrollTop = function () {
        return getDocumentHeight() - getClientHeight();
    }

    /**
     * Return the actual scroll position of an element in the document.
     *
     * @param {String} elementId
     * @return {number}
     */
    const getElementPosition = function (elementId) {
        const element = document.getElementById(elementId);

        if (!element) {
            return 0;
        }

        const boundingBox = element.getBoundingClientRect();
        return boundingBox.top;
    }

    /**
     * Takes small steps until reach the target.
     *
     * @param {Number} from
     * @param {Number} to
     */
    const smoothScroll = function (from, to) {
        const stepBy = 0.2;
        const snapDistance = 1;
        const speed = 30;
        const diff = to - from;

        if (Math.abs(diff) <= snapDistance) {
            scrollTo(0.0, to);

            verbose && console.info(
                '%c[Smooth Scroll]%c ✔%c Scroll end.',
                'background:'+consoleColorId+';color:black;font-weight:bold;',
                'color:green; font-weight:bold;',
                'color:#599bd6; font-weight:bold;',
            );

            return;
        }

        const nextPosition = (from * (1.0 - stepBy)) + (to * stepBy);
        scrollTo(0.0, Math.round(nextPosition));

        setTimeout(smoothScroll, speed, nextPosition, to);
    }

    /**
     * Initializes the component and collects the elements.
     */
    const initialize = function ()
    {
        utility.triggerEvent({element: document, eventName: 'Component.SmoothScroll.Ready', delay: 1});
    };

    verbose && console.info(
        '%c[Smooth Scroll]%c ✔%c The Smooth Scroll component loaded.',
        'background:'+consoleColorId+';color:black;font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:#599bd6; font-weight:bold;'
    );

    initialize();

    return {
        /**
         * Return the actual scroll position in pixels.
         *
         * @return {number}
         */
        getScrollPosition: function() {
            return getScrollPosition();
        },

        /**
         * Return the actual scroll position of an element in the document.
         *
         * @param {String} elementId
         * @return {number}
         */
        getElementPositionById: function({elementId}) {
            return getElementPosition(elementId);
        },

        /**
         * Scroll to an element specified by its ID.
         *
         * @param {String} elementId The ID of the HTML element to scroll
         * @param {Number} gap       The gap to keep on top in pixels
         */
        scrollToElementById: function({elementId, gap}) {
            const element = document.getElementById(elementId);

            if (!element) {
                return false;
            }

            const targetPosition = Math.min((getScrollPosition() + getElementPosition(elementId) - gap), getMaxScrollTop());

            verbose && console.info(
                '%c[Smooth Scroll]%c ✔%c Start scroll from %c%o%c to %c%o%c.',
                'background:'+consoleColorId+';color:black;font-weight:bold;',
                'color:green; font-weight:bold;',
                'color:#599bd6; font-weight:bold;',
                'color:red; font-weight:bold;',
                getScrollPosition(),
                'color:#599bd6; font-weight:bold;',
                'color:red; font-weight:bold;',
                targetPosition,
                'color:#599bd6; font-weight:bold;',
            );

            smoothScroll(getScrollPosition(), targetPosition);
        }
    };
};

window['SmoothScroll'] = SmoothScroll;
