/**
 * Cookie component
 *
 * @type {{init: Cookie.init, set: Cookie.set, MAX_COOKIE_EXPIRATION_DAYS: number, get: Cookie.get, renew: Cookie.renew, delete: Cookie.delete}}
 */
const Cookie = function ({verbose = false})
{
    /** @type {boolean} */
    let initialized = false;
    /** @type {string} */
    let consoleColorId = '#606366';

    if (typeof Util === 'undefined') {
        throw new ReferenceError('This component requires the Util component to be loaded.');
    }

    verbose && console.info(
        '%c[Cookie]%c ✔%c The Cookie Component loaded.',
        'color:white;background:'+consoleColorId+';font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:black; font-weight:bold;'
    );

    return {
        MAX_COOKIE_EXPIRATION_DAYS: 7,

        /**
         * Initializes the component.
         */
        init : function () {
            initialized = true;
            Util.triggerEvent({element: document, eventName: 'Component.Cookie.Ready'});
        },

        /**
         * Set a cookie.
         *
         * @param {string} cookieName  The name of the cookie
         * @param {string} cookieValue The value of the cookie
         * @param {number} expirationDays Expiration days
         * @param {boolean} standardLog Whether to log the standard info or not
         */
        set: function ({cookieName, cookieValue, expirationDays = this.MAX_COOKIE_EXPIRATION_DAYS, standardLog = true}) {
            // Safari and Brave force JS cookies to have a max 7 days of expiration
            expirationDays = Math.min(this.MAX_COOKIE_EXPIRATION_DAYS, expirationDays);

            let date = new Date();
            date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
            let expires = "expires="+ date.toUTCString();

            standardLog && verbose && console.info(
                '%c[Cookie]%c ⚡%c Setting Cookie : %o',
                'color:white;background:'+consoleColorId+';font-weight:bold;',
                'color:orange;font-weight:bold',
                'color:#599bd6',
                cookieName
            );
            document.cookie = cookieName + '=' + cookieValue + ';' + expires + ';path=/;SameSite=Lax' + (location.protocol === 'https:' ? ';secure' : '');
        },

        /**
         * Retrieve a cookie value.
         *
         * @param {string} cookieName The name of the cookie
         * @returns {string}
         */
        get: function ({cookieName}) {
            let name = cookieName + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let cookieArray = decodedCookie.split(';');
            for (let i = 0, num = cookieArray.length; i < num; i++) {
                let cookie = cookieArray[i];
                while (cookie.charAt(0) === ' ') {
                    cookie = cookie.substring(1);
                }
                if (cookie.indexOf(name) === 0) {
                    return cookie.substring(name.length, cookie.length);
                }
            }
            return '';
        },

        /**
         * Renew a cookie if exists.
         *
         * @param {string} cookieName The name of the cookie
         * @param {number} expirationDays Expiration days of the cookie
         */
        renew: function({cookieName, expirationDays = this.MAX_COOKIE_EXPIRATION_DAYS}) {
            let cookieValue = this.get({cookieName: cookieName});
            if (cookieValue !== '') {
                verbose && console.info(
                    '%c[Cookie]%c ⚡%c Renew Cookie : %o',
                    'color:white;background:'+consoleColorId+';font-weight:bold;',
                    'color:orange;font-weight:bold',
                    'color:#599bd6',
                    cookieName
                );

                this.set({cookieName: cookieName, cookieValue: cookieValue, expirationDays: expirationDays, standardLog: false});
            }
        },

        /**
         * Delete a cookie if exists.
         *
         * @param {string} cookieName The name of the cookie
         */
        delete: function(cookieName) {
            let cookieValue = this.get({cookieName: cookieName});

            if (cookieValue !== '') {
                verbose && console.info(
                    '%c[Cookie]%c ⚡%c Delete Cookie : %o',
                    'color:white;background:'+consoleColorId+';font-weight:bold;',
                    'color:orange;font-weight:bold',
                    'color:#599bd6',
                    cookieName
                );

                this.set({cookieName: cookieName, cookieValue:'', expirationDays: -1});
            }
        },
    }
}({verbose: true});

window['Cookie'] = Cookie;

