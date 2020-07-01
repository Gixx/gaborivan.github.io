/**
 * Collapsible component.
 * @param {object} utility
 * @param {boolean} verbose
 * @returns {*}
 */
const Collapsible = function ({utility, verbose = false})
{
    /** @type {NodeList} */
    let collapsibleButtons;
    /** @type {number} */
    let idCounter = 1;
    /** @type {string} */
    const consoleColorId = '#dde518';

    if (!utility instanceof Utility) {
        throw new ReferenceError('This component requires the Utility component to be loaded.');
    }

    /**
     * A Collapsible Element.
     *
     * @param {HTMLDivElement|Node} HTMLElement
     * @return {*}
     */
    const CollapsibleElement = function (HTMLElement)
    {
        if (!HTMLElement.nextElementSibling.classList.contains('collapsible__content')) {
            return false;
        }

        HTMLElement.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });

        verbose && console.info(
            '%c[Collapsible]%c ✚%c a Collapsible element initialized %o',
            'background:'+consoleColorId+';color:black;font-weight:bold;',
            'color:green; font-weight:bold;',
            'color:#599bd6;font-style:italic',
            '#'+HTMLElement.getAttribute('id')
        );

        return {

        }
    }

    /**
     * Initializes the component and collects the elements.
     */
    const initialize = function ()
    {
        verbose && console.info(
            '%c[Collapsible]%c ...looking for Collapsible elements.',
            'background:'+consoleColorId+';color:black;font-weight:bold;',
            'color:#599bd6;font-style:italic'
        );

        collapsibleButtons = document.querySelectorAll('.collapsible');

        collapsibleButtons.forEach(function (element) {
            if (typeof element.component === 'undefined') {
                /** @type {HTMLDivElement|Node} element */
                if (!element.hasAttribute('id')) {
                    element.setAttribute('id', 'collapsible' + (idCounter++));
                }

                const component = new CollapsibleElement(element);

                if (!component) {
                    element.remove();
                }

                element.component = component;
            }
        });

        utility.triggerEvent({element: document, eventName: 'Component.Collapsible.Ready', delay: 1});
    };

    verbose && console.info(
        '%c[Collapsible]%c ✔%c The Collapsible component loaded.',
        'background:'+consoleColorId+';color:black;font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:#599bd6; font-weight:bold;'
    );

    initialize();

    return {

    };
};

window['Collapsible'] = Collapsible;
