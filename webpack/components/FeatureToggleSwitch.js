/**
 * Feature Toggle component.
 *
 * @param {object} utility
 * @param {object} storage
 * @param {object} featureToggleTargets
 * @param {boolean} verbose
 * @returns {*}
 */
const FeatureToggleSwitch = function ({utility, storage, options = {}, verbose = false})
{
    /** @type {NodeList} */
    let featureToggleSwitches;
    /** @type {number} */
    let idCounter = 1;
    /** @type {string} */
    const consoleColorId = '#FF9B49';

    if (!utility instanceof Utility) {
        throw new ReferenceError('This component requires the Utility component to be loaded.');
    }

    if (!storage instanceof CookieStorage || !storage instanceof DataStorage) {
        throw new ReferenceError('This component requires either the CookieStorage or the LocalStorage component to be loaded.');
    }

    /**
     * A Feature Toggle Switch element
     *
     * @param {HTMLDivElement|Node} HTMLElement
     * @param {String} featureName
     * @param {{state: boolean, label: string, storageKey: string}} toggleOptions
     * @returns {*}
     */
    const FeatureToggleSwitchElement = function (HTMLElement, featureName, toggleOptions)
    {
        // Wipe out any dirt
        HTMLElement.innerHTML = '';

        let state = storage.get({key: toggleOptions.storageKey}) === 'On'
            ? true
            : toggleOptions.state;

        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', HTMLElement.id + '-' + featureName);
        checkbox.addEventListener('change', function () {
            toggleSwitch(featureName)
        });

        const label = document.createElement('label');
        label.setAttribute('for', HTMLElement.id + '-' + featureName);
        const labelText = document.createElement('span');
        labelText.innerHTML =  toggleOptions.label;
        const labelSwitch = document.createElement('span');
        label.appendChild(labelText);
        label.appendChild(labelSwitch);

        HTMLElement.appendChild(checkbox);
        HTMLElement.appendChild(label);

        /**
         *
         * @param {Boolean} setActive
         */
        const switchState = function(setActive) {
            state = setActive;
            document.getElementById(HTMLElement.id + '-' + featureName).checked = state;
            storage.set({key: toggleOptions.storageKey, value: (state ? 'On' : 'Off')});
        };

        switchState(state);

        verbose && console.info(
            '%c[Feature Toggle Switch]%c ✚%c a switch element initialized %o',
            'background:'+consoleColorId+';color:black;font-weight:bold;',
            'color:green; font-weight:bold;',
            'color:#599bd6;font-style:italic',
            '#'+HTMLElement.getAttribute('id')
        );

        return {
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

    /**
     * Initialize the component handler.
     */
    const initialize = function(reScan = false)
    {
        !reScan && verbose && console.info(
            '%c[Feature Toggle Switch]%c ...looking for Feature Toggle Switch elements.',
            'background:'+consoleColorId+';color:black;font-weight:bold;',
            'color:#599bd6;font-style:italic'
        );

        featureToggleSwitches = document.querySelectorAll('.FeatureToggle[data-feature]');

        featureToggleSwitches.forEach(function (element) {
            if (typeof element.component === 'undefined') {
                /** @type {HTMLDivElement|Node} element */
                if (!element.hasAttribute('id')) {
                    element.setAttribute('id', 'featureToggle' + (idCounter++));
                }

                const featureName = element.dataset.feature;
                const featureValue = 'value' in element.dataset ? element.dataset.value : 'off';
                const state = featureValue !== 'off';
                const toggleOptions = (typeof options[featureName] !== 'undefined')
                    ? options[featureName]
                    : {state: state, label: 'Toggle feature "'+featureName+'" On or Off', storageKey: 'feature_'+featureName};

                element.component = new FeatureToggleSwitchElement(element, featureName, toggleOptions);
            }
        });

        !reScan && utility.triggerEvent({element: document, eventName: 'Component.FeatureToggleSwitch.Ready', delay: 1});
    };

    /**
     * Get all FeatureToggle elements by name.
     *
     * @param {String} featureToggleName The non-unique name of the FeatureToggle element.
     * @returns {[]}
     */
    const getElementsByName = function(featureToggleName)
    {
        const components = [];

        featureToggleSwitches.forEach(function (element) {
            if (typeof element.component !== 'undefined') {
                if (element.component.getFeatureName() === featureToggleName) {
                    components.push(element.component);
                }
            }
        });

        return components;
    };

    /**
     * Toggle FeatureToggle element(s) by the given name.
     *
     * @param {String} featureToggleName The non-unique name of the FeatureToggle element.
     * @return {Array}
     */
    const toggleSwitch = function(featureToggleName)
    {
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
    };

    /**
     * Toggle on/off all FeatureToggle elements.
     *
     * @param {String} newState The new status: 'on' or 'off'.
     */
    const toggleAll = function (newState = 'on')
    {
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
    };

    verbose && console.info(
        '%c[Feature Toggle Switch]%c ✔%c The Feature Toggle Switch component loaded.',
        'background:'+consoleColorId+';color:black;font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:#599bd6; font-weight:bold;'
    );

    initialize();

    return {
        reScan: function() {
            initialize();
        },
        /**
         * Get all FeatureToggle elements by name.
         *
         * @param {String} featureToggleName The non-unique name of the FeatureToggle element.
         * @returns {[]}
         */
        getElementsByName : function({featureToggleName}) {
            return getElementsByName(featureToggleName);
        },

        /**
         * Toggle FeatureToggle element(s) by the given name.
         *
         * @param {String} featureToggleName The non-unique name of the FeatureToggle element.
         * @return {Array}
         */
        toggleSwitch : function({featureToggleName}) {
            toggleSwitch(featureToggleName);
        },

        /**
         * Toggle on/off all FeatureToggle elements.
         *
         * @param {String} newState The new status: 'on' or 'off'.
         */
        toggleAll : function ({newState = 'on'}) {
            toggleAll(newState);
        }
    };
};

window['FeatureToggleSwitch'] = FeatureToggleSwitch;
