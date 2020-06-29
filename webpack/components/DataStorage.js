/**
 * Data Storage component.
 *
 * @param {object} utility
 * @param {boolean} verbose
 * @returns {*}
 */
const DataStorage = function ({utility, verbose = false})
{
    /** @type {string} */
    const consoleColorId = '#13D225';
    /** @type {object} */
    const storage = {};

    if (!utility instanceof Utility) {
        throw new ReferenceError('This component requires the Utility component to be loaded.');
    }

    if (typeof(Storage) === 'undefined') {
        throw new ReferenceError('Your browser does not support the local/session storage feature.');
    }

    /**
     * Initialize component
     */
    const initialize = function()
    {
        initStorageKeys(localStorage);
        initStorageKeys(sessionStorage);

        utility.triggerEvent({element: document, eventName: 'Component.DataStorage.Ready'});
    };

    /**
     * Fills up the registry.
     *
     * @param storageEngine
     */
    const initStorageKeys = function(storageEngine)
    {
        const storageKeys = Object.keys(storageEngine);
        let i = storageKeys.length;

        while (i--) {
            storage[storageKeys[i]] = storageEngine;
        }
    };

    /**
     * Set data.
     *
     * @param {string} key      The name of the key
     * @param {string} value    The value
     * @param {boolean} session Mark it as session data (for the logging only)
     */
    const setData = function (key, value, session = false)
    {
        verbose && console.info(
            '%c[Data Storage]%c ⚡%c Setting data into dataStorage: %o'+(session ? ' (session)' : ''),
            'background:'+consoleColorId+';color:black;font-weight:bold;',
            'color:orange;font-weight:bold',
            'color:#599bd6;font-style:italic',
            key
        );
        typeof storage[key] !== 'undefined' && storage[key].setItem(key, value);
    };

    /**
     * Retrieve data by key.
     *
     * @param {string} key The name of the key
     * @returns {string}
     */
    const getDataByKey = function (key)
    {
        return typeof storage[key] !== 'undefined'
            ? storage[key].getItem(key)
            : '';
    };

    /**
     * Delete data by key.
     *
     * @param {string} key The name of the key
     */
    const deleteDataByKey = function(key)
    {
        typeof storage[key] !== 'undefined' && storage[key].removeItem(key);
    };

    verbose && console.info(
        '%c[Data Storage]%c ✔%c The Data Storage Component loaded.',
        'background:'+consoleColorId+';color:black;font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:#599bd6; font-weight:bold;'
    );

    initialize();

    return {
        /**
         * Set data.
         *
         * @param {string} key   The name of the key
         * @param {string} value The value
         * @param {boolean} session The data should be deleted when the browser session ends.
         */
        set: function ({key, value, session = false}) {
            // To avoid to leave mess in local storage when setting an existing key to session storage, first we delete.
            deleteDataByKey(key);

            storage[key] = session ? sessionStorage : localStorage;

            setData(key, value, session);
        },

        /**
         * Retrieve data by key.
         *
         * @param {string} key The name of the key
         * @returns {string}
         */
        get: function ({key}) {
            return getDataByKey(key);
        },

        /**
         * Renew a data if exists.
         * No real use. Its only purpose is to be compatible with the CookieStorage.
         *
         * @param {string} key The name of the key
         * @param {boolean} session The data should be deleted when the browser session ends.
         */
        renew: function({key, session = false}) {
            const value = getDataByKey(key);

            if (value !== '') {
                this.set({key: key, value: value, session: session});
            }
        },

        /**
         * Delete data by key.
         *
         * @param {string} key The name of the key
         */
        delete: function({key}) {
            deleteDataByKey(key);
        },
    }
};

window['DataStorage'] = DataStorage;
