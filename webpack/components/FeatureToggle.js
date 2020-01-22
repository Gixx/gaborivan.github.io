/**
 * Feature Toggle component
 *
 * @type {{init: FeatureToggle.init, toggleAll: FeatureToggle.toggleAll, toggle: FeatureToggle.toggle, getComponentsByName: (function({featureToggleName: String}): [])}}
 */
const FeatureToggle = function ({verbose = false})
{
    /** @type {boolean} */
    let initialized = false;
    /** @type {NodeList} */
    let featureToggleSwitches;
    /** @type {number} */
    let idCounter = 1;
    /** @type {string} */
    let consoleColorId = '#FF9B49';

    if (typeof Util === 'undefined') {
        throw new ReferenceError('This component requires the Util component to be loaded.');
    }

    if (typeof Cookie === 'undefined') {
        throw new ReferenceError('This component requires the Cookie component to be loaded.');
    }

    /**
     * A Feature Toggle Switch element
     *
     * @param {HTMLDivElement|Node} HTMLElement
     * @param {String} featureName
     * @param {{state: boolean, label: string, cookie: string}} toggleOptions
     * @returns {*}
     * @constructor
     */
    let FeatureToggleSwitchElement = function ({HTMLElement, featureName, toggleOptions})
    {
        // Wipe out any dirt
        HTMLElement.innerHTML = '';

        let state = Cookie.get({cookieName: toggleOptions.cookie}) === 'On'
            ? true
            : toggleOptions.state;

        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', HTMLElement.id + '-' + featureName);
        checkbox.addEventListener('change', function () {
            FeatureToggle.toggle({featureToggleName: featureName})
        });

        let label = document.createElement('label');
        label.setAttribute('for', HTMLElement.id + '-' + featureName);
        let labelText = document.createTextNode(toggleOptions.label);
        let labelSwitch = document.createElement('span');
        label.appendChild(labelText);
        label.appendChild(labelSwitch);

        HTMLElement.appendChild(checkbox);
        HTMLElement.appendChild(label);

        /**
         *
         * @param {Boolean} setActive
         */
        let switchState = function (setActive) {
            state = setActive;
            document.getElementById(HTMLElement.id + '-' + featureName).checked = state;
            Cookie.set({cookieName: toggleOptions.cookie, cookieValue: (state ? 'On' : 'Off')});
        };

        switchState(state);

        verbose && console.info(
            '%c[Feature Toggle Switch]%c ✚%c a switch element initialized %o',
            'background:'+consoleColorId+';font-weight:bold;',
            'color:green; font-weight:bold;',
            'color:black;',
            '#'+HTMLElement.getAttribute('id')
        );

        return {
            constructor : FeatureToggleSwitchElement,

            /**
             * Returns the feature name.
             *
             * @returns {String}
             */
            getFeatureName : function() {
                return featureName;
            },

            /**
             * Returns the current state.
             *
             * @returns {String}
             */
            getState : function () {
                return state ? 'on' : 'off';
            },

            /**
             * Toggles the switch on.
             */
            on : function() {
                switchState(true);
            },

            /**
             * Toggles the switch off.
             */
             off : function () {
                switchState(false);
            }
        }
    };

    verbose && console.info(
        '%c[Feature Toggle Switch]%c ✔%c The Feature Toggle Switch element component loaded.',
        'background:'+consoleColorId+';font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:black; font-weight:bold;'
    );

    return {
        /**
         * Initialize the component handler.
         */
        init : function () {
            if (initialized) {
                return;
            }

            let featureToggleTargets = typeof arguments[0] !== 'undefined'
                ? arguments[0]
                : {};

            verbose && console.info(
                '%c[Feature Toggle Switch]%c ...looking for Feature Toggle Switch elements.',
                'background:'+consoleColorId+';font-weight:bold;',
                'color:#cecece'
            );

            featureToggleSwitches = document.querySelectorAll('div[data-feature]');

            featureToggleSwitches.forEach(function (element) {
                /** @type {HTMLDivElement|Node} element */
                if (!element.hasAttribute('id')) {
                    element.setAttribute('id', 'featureToggle' + (idCounter++));
                }

                let featureName = element.dataset.feature;
                let toggleOptions = (typeof featureToggleTargets[featureName] !== 'undefined')
                    ? featureToggleTargets[featureName]
                    : {state: false, label: 'Toggle feature "'+featureName+'" On or Off', cookie: 'feature_'+featureName};

                element.component = new FeatureToggleSwitchElement({HTMLElement: element, featureName: featureName, toggleOptions: toggleOptions});
            });

            Util.triggerEvent({element: document, eventName: 'Component.FeatureToggle.Ready'});
            initialized = true;
        },

        /**
         * Get all FeatureToggle elements by name.
         *
         * @param {String} featureToggleName The non-unique name of the FeatureToggle element.
         * @returns {[]}
         */
        getComponentsByName : function({featureToggleName}) {
            if (!initialized) {
                this.init();
            }

            let components = [];

            featureToggleSwitches.forEach(function (element) {
                if (typeof element.component !== 'undefined') {
                    if (element.component.getFeatureName() === featureToggleName) {
                        components.push(element.component);
                    }
                }
            });

            return components;
        },

        /**
         * Toggle FeatureToggle element(s) by the given name.
         *
         * @param {String} featureToggleName The non-unique name of the FeatureToggle element.
         * @return {Array}
         */
        toggle : function({featureToggleName}) {
            if (!initialized) {
                this.init();
            }

            featureToggleSwitches.forEach(function (element) {
                if (typeof element.component !== 'undefined') {
                    if (element.component.getFeatureName() === featureToggleName) {
                        if (element.component.getState() === 'on') {
                            element.component.off();
                        } else {
                            element.component.on();
                        }
                    }
                }
            });
        },

        /**
         * Toggle on/off all FeatureToggle elements.
         *
         * @param {String} newState The new status: 'on' or 'off'.
         */
        toggleAll : function ({newState = 'on'}) {
            if (!initialized) {
                this.init();
            }

            if (['on', 'off'].indexOf(newState) === -1) {
                newState = 'on';
            }

            featureToggleSwitches.forEach(function (element) {
                if (typeof element.component !== 'undefined') {
                    if (newState === 'on') {
                        element.component.on();
                    } else {
                        element.component.off();
                    }
                }
            });
        }
    };
}({verbose: true});

window['FeatureToggle'] = FeatureToggle;
