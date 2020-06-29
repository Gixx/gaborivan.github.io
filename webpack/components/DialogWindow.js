/**
 * DialogWindow component.
 * @param {object} utility
 * @param {boolean} verbose
 * @returns {*}
 */
const DialogWindow = function ({utility, verbose = false})
{
    /** @type {NodeList} */
    let dialogElements;
    /** @type {number} */
    let idCounter = 1;
    /** @type {string} */
    const consoleColorId = '#FFA3EA';

    if (!utility instanceof Utility) {
        throw new ReferenceError('This component requires the Utility component to be loaded.');
    }

    /**
     * A Dialog element.
     *
     * @param {HTMLDivElement|Node} HTMLElement
     * @returns {*}
     */
    const DialogElement = function (HTMLElement)
    {
        const okButton = HTMLElement.querySelector('.d-buttons__ok');
        const saveButton = HTMLElement.querySelector('.d-buttons__save');
        const applyButton = HTMLElement.querySelector('.d-buttons__apply');
        const deleteButton = HTMLElement.querySelector('.d-buttons__delete');
        const cancelButton = HTMLElement.querySelector('.d-buttons__cancel');
        const closeButton = HTMLElement.querySelector('.d-buttons__close');

        const introTabSwitchButton = HTMLElement.querySelector('.d-buttons__showIntro');
        const settingsTabSwitchButton = HTMLElement.querySelector('.d-buttons__showSettings');

        const contentIntro = HTMLElement.querySelector('.d-tab.-intro');
        const contentSettings = HTMLElement.querySelector('.d-tab.-settings');

        const openDialog = function() {
            HTMLElement.style.display = 'block';
            verbose && console.info(
                '%c[Dialog Window]%c ⚡%c "'+HTMLElement.id+'" Dialog window is opened : %o',
                'background:'+consoleColorId+';color:black;font-weight:bold;',
                'color:orange;font-weight:bold',
                'color:#599bd6;font-style:italic',
                HTMLElement.id
            );
        };

        const dialogName = HTMLElement.dataset.name;

        /**
         * Closes the modal window
         */
        const closeDialog = function () {
            HTMLElement.style.display = 'none';
            verbose && console.info(
                '%c[Dialog Window]%c ⚡%c "'+HTMLElement.id+'" Dialog window is closed : %o',
                'background:'+consoleColorId+';color:black;font-weight:bold;',
                'color:orange;font-weight:bold',
                'color:#599bd6;font-style:italic',
                HTMLElement.id
            );
        };

        /**
         * Button click events
         */
        okButton && okButton.addEventListener('click', function () {
            utility.triggerEvent({element: HTMLElement, eventName: 'Component.Dialog.Action.OK'});
            closeDialog();
        });

        saveButton && saveButton.addEventListener('click', function () {
            utility.triggerEvent({element: HTMLElement, eventName: 'Component.Dialog.Action.Save'});
            closeDialog();
        });

        applyButton && applyButton.addEventListener('click', function () {
            utility.triggerEvent({element: HTMLElement, eventName: 'Component.Dialog.Action.Apply'});
            closeDialog();
        });

        deleteButton && deleteButton.addEventListener('click', function () {
            utility.triggerEvent({element: HTMLElement, eventName: 'Component.Dialog.Action.Delete'});
            closeDialog();
        });

        cancelButton && cancelButton.addEventListener('click', function () {
            utility.triggerEvent({element: HTMLElement, eventName: 'Component.Dialog.Action.Cancel'});
            closeDialog();
        });

        closeButton && closeButton.addEventListener('click', function () {
            utility.triggerEvent({element: HTMLElement, eventName: 'Component.Dialog.Action.Close'});
            closeDialog();
        });

        settingsTabSwitchButton && settingsTabSwitchButton.addEventListener('click', function () {
            contentIntro.classList.remove('-active');
            contentSettings.classList.add('-active');
        });

        introTabSwitchButton && introTabSwitchButton.addEventListener('click', function () {
            contentIntro.classList.add('-active');
            contentSettings.classList.remove('-active');
        });

        verbose && console.info(
            '%c[Dialog Window]%c ✚%c the "'+HTMLElement.id+'" Dialog element is initialized %o',
            'background:'+consoleColorId+';color:black;font-weight:bold;',
            'color:green; font-weight:bold;',
            'color:#599bd6;font-style:italic',
            '#'+HTMLElement.getAttribute('id')
        );

        return {
            getName: function() {
                return dialogName;
            },

            /**
             * Opens the modal window.
             */
            open: function() {
                openDialog();
            },

            /**
             * Closes the modal window
             */
            close: function () {
                closeDialog();
            }
        }
    };

    /**
     * Get a Dialog element by name.
     *
     * @param {String} dialogName The unique name of the Dialog element.
     * @returns {DialogElement|null}
     */
    const getDialogByName = function(dialogName)
    {
        let dialogElement = null;

        dialogElements.forEach(function (element) {
            if (typeof element.component !== 'undefined') {
                if (element.component.getName() === dialogName) {
                    dialogElement = element.component;
                }
            }
        });

        return dialogElement;
    };

    /**
     * Initializes the component and collects the elements.
     */
    const initialize = function ()
    {
        verbose && console.info(
            '%c[Dialog Window]%c ...looking for Dialog elements.',
            'background:'+consoleColorId+';color:black;font-weight:bold;',
            'color:#599bd6;font-style:italic'
        );

        dialogElements = document.querySelectorAll('div.dialog');
        dialogElements.forEach(function (element) {
            if (!element.hasAttribute('id')) {
                element.setAttribute('id', 'dialog-' + (idCounter++));
            }

            element.component = new DialogElement(element);
        });

        utility.triggerEvent({element: document, eventName: 'Component.DialogWindow.Ready', delay: 1});
    };

    verbose && console.info(
        '%c[Dialog Window]%c ✔%c The Dialog component loaded.',
        'background:'+consoleColorId+';color:black;font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:#599bd6; font-weight:bold;'
    );

    initialize();

    return {
        /**
         * Returns the collection of dialog-elements
         *
         * @return {NodeList}
         */
        getAllDialogs: function () {
            return dialogElements;
        },

        /**
         *
         * @param {String} name
         */
        getDialogByName: function({name}) {
            return getDialogByName(name);
        }
    };
};

window['DialogWindow'] = DialogWindow;
