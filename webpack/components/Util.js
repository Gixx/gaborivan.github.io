/**
 * Util component
 *
 * @type {{init: Util.init, getEventPath: Util.getEventPath, fetch: Util.fetch, getDeviceOs: (function(): string), triggerEvent: Util.triggerEvent, ajax: (function({url?: string, method?: string, async?: boolean, enctype?: string, data?: (FormData|Object), successCallback?: (null|Function), failureCallback?: (null|Function)}): XMLHttpRequest)}}
 */
const Util = function ({verbose = false}) {
    /** @type {boolean} */
    let initialized = false;
    /** @type {string} */
    let consoleColorId = '#D7CFFF';

    verbose && console.info(
        '%c[Util]%c ✔%c The Util Component loaded.',
        'background:'+consoleColorId+';font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:black; font-weight:bold;'
    );

    /**
     * Converts a form data to object
     *
     * @param {FormData} formData
     * @return {Object}
     */
    let formDataToObject = function ({formData}) {
        let object = {};

        formData.forEach(function (value, key) {
            object[key] = value;
        });

        return object;
    };

    /**
     * Converts an object to form data
     *
     * @param {Object} object
     * @return {FormData}
     */
    let objectToFormData = function ({object}) {
        let formData = new FormData();

        for (let attribute in object) {
            if (object.hasOwnProperty(attribute)) {
                formData.append(attribute, object[attribute]);
            }
        }

        return formData
    };

    return {
        /**
         * Initializes the component.
         */
        init : function () {
            initialized = true;
            this.triggerEvent({element: document, eventName: 'Component.Util.Ready'});
        },

        /**
         * Makes an XmlHttpRequest.
         *
         * @param {string} url
         * @param {string} method
         * @param {boolean} async
         * @param {string} enctype
         * @param {FormData|object} data
         * @param {null|function} successCallback
         * @param {null|function} failureCallback
         * @returns {XMLHttpRequest}
         */
        ajax : function ({url = '/', method = 'POST', async = true, enctype = 'application/json', data = {}, successCallback = null, failureCallback = null}) {
            if (typeof successCallback !== 'function') {
                successCallback = function (data) {};
            }

            if (typeof failureCallback !== 'function') {
                failureCallback =  function (data) {};
            }

            let rnd = new Date().getTime();
            url = url + (url.lastIndexOf('?') === -1 ? '?' : '&') + 'timestamp=' + rnd;

            let xhr = new XMLHttpRequest();
            xhr.open(method, url, async);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    try {
                        if (xhr.status === 200) {
                            successCallback(xhr.responseText);
                        } else {
                            failureCallback(xhr.responseText);
                        }
                    } catch (exp) {
                        verbose && console.warn('JSON parse error. Continue', exp);
                    }
                }
            };

            // if NOT multipart/form-data, turn the FromData into object
            if (data instanceof FormData && enctype !== 'multipart/form-data') {
                data = formDataToObject(data);
            }

            // if mulitpart/form-data, turn the data into FormData
            if (!data instanceof FormData && enctype === 'multipart/form-data') {
                data = objectToFormData(data);
            }

            switch (enctype) {
                case 'application/json':
                    data = JSON.stringify(data);
                    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                    break;

                case 'application/x-www-form-urlencoded':
                    data = Object.keys(data).map(function (key) {
                        return key + '=' + data[key]
                    }).join('&');
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                    break;

                case 'multipart/form-data':
                    xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                    break;
            }

            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.send(data);

            return xhr;
        },

        /**
         * Fetches a URL
         *
         * @param {string} url
         * @param {string} method
         * @param {boolean} async
         * @param {string} enctype
         * @param {FormData|object} data
         * @param {null|function} successCallback
         * @param {null|function} failureCallback
         */
        fetch: function ({url = '/', method = 'POST', async = true, enctype = 'application/json', data = {}, successCallback = null, failureCallback = null}) {
            if (typeof successCallback !== 'function') {
                successCallback = function (data) {};
            }

            if (typeof failureCallback !== 'function') {
                failureCallback =  function (data) {};
            }

            switch (enctype) {
                case 'application/json':
                    if (data instanceof FormData) {
                        data = formDataToObject(data);
                    }

                    data = JSON.stringify(data);
                    break;

                case 'application/x-www-form-urlencoded':
                    if (data instanceof FormData) {
                        data = formDataToObject(data);
                    }

                    data = Object.keys(data).map(function (key) {
                        return key + '=' + data[key]
                    }).join('&');
                    break;

                case 'multipart/form-data':
                    if (!data instanceof FormData) {
                        data = objectToFormData(data);
                    }
                    break;
            }

            let request = {
                method: method,
                headers: {
                    'Content-Type': enctype,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };

            if (method !== 'GET' && method !== 'HEAD') {
                request.body = data;
            }

            verbose && console.info(
                '%c[Util]%c ⚡%c Fetching URL %o',
                'background:'+consoleColorId+';font-weight:bold;',
                'color:orange;font-weight:bold',
                'color:#599bd6',
                url
            );

            fetch(url, request)
                .then(function (response) {
                    if (response.ok) {
                        successCallback(response);
                    } else {
                        let error = new Error(response.statusText || response.status);
                        error.response = response;
                        throw error
                    }
                })
                .catch(function (err) {
                    failureCallback(err);
                });
        },

        /**
         * Triggers an event on an element.
         *
         * @param {*}   element
         * @param {string} eventName
         * @param {*}      [customData]
         */
        triggerEvent : function ({element, eventName, customData = null}) {
            let event;

            if (customData !== null) {
                event = new CustomEvent(eventName, {'detail': customData})
            } else {
                event = new Event(eventName);
            }

            verbose && console.info(
                '%c[Util]%c ⚡%c Triggering event: %o',
                'background:'+consoleColorId+';font-weight:bold;',
                'color:orange;font-weight:bold',
                'color:#599bd6',
                eventName
            );

            element.dispatchEvent(event);
        },

        /**
         * Returns the event element path.
         *
         * @param {Event} event
         * @return {Array}
         */
        getEventPath: function ({event}) {
            let path = (event.composedPath && event.composedPath()) || event.path,
                target = event.target;

            if (typeof path !== 'undefined') {
                // Safari doesn't include Window, and it should.
                path = (path.indexOf(window) < 0) ? path.concat([window]) : path;
                return path;
            }

            if (target === window) {
                return [window];
            }

            function getParents(node, memo)
            {
                memo = memo || [];
                let parentNode = node.parentNode;

                if (!parentNode) {
                    return memo;
                } else {
                    return getParents(parentNode, memo.concat([parentNode]));
                }
            }

            return [target]
                .concat(getParents(target))
                .concat([window]);
        },

        /**
         * Tries to figure out the operating system
         *
         * @returns {string}
         */
        getDeviceOs: function () {
            let operatingSystem = 'Unknown';
            let patterns = ['Win', 'Mac', 'X11', 'Linux', 'iPhone', 'iPad', 'Android'];
            let supportedOperatingSystems = ['Windows', 'MacOS', 'Unix', 'Linux', 'iOS', 'iOS', 'Android'];

            for (let i in patterns) {
                if (navigator.platform.indexOf(patterns[i]) !== -1) {
                    operatingSystem = supportedOperatingSystems[i];
                }
            }

            return operatingSystem;
        }
    };
}({verbose: true});

window['Util'] = Util;
