require('./components/Utility');
require('./components/SmoothScroll');
require('./components/DataStorage');
require('./components/CookieStorage');
require('./components/FeatureToggleSwitch');
require('./components/LazyLoadImage');
require('./components/DialogWindow');
require('./components/BarChart');
require('./components/Collapsible');

window['Components'] = {};
const verboseLog = true;
let utility = null;

document.addEventListener('DOMContentLoaded', function(event) {
    utility = new Utility({verbose: verboseLog});
})

document.addEventListener('Component.Utility.Ready', function () {
    let dataStorage;

    try {
        dataStorage = new DataStorage({utility: utility, verbose: verboseLog});
    } catch (e) {
        dataStorage = new CookieStorage({utility: utility, verbose: verboseLog});
    }

    window.Components.utility = utility;
    window.Components.dataStorage = dataStorage;
    window.Components.smoothScoll = new SmoothScroll({utility: utility, verbose: verboseLog});
    window.Components.lazyLoadImage = new LazyLoadImage({utility: utility, verbose: verboseLog});
    window.Components.barChart = new BarChart({utility: utility, verbose: verboseLog});
    window.Components.collapsible = new Collapsible({utility: utility, verbose: verboseLog});
    window.Components.featureToggle = new FeatureToggleSwitch({utility: utility, storage: dataStorage, verbose: verboseLog});

    Promise.allSettled(fetchDialogs()).then(function(response) {
        window.Components.dialogWindow = new DialogWindow({utility: utility, verbose: verboseLog});
    });
});

/**
 *Add smooth scroll function for content anchor link.
 */
document.addEventListener('Component.SmoothScroll.Ready', function() {
    const scrollToContentButton = document.querySelector('.m-menu__link.-downarrow');

    if (scrollToContentButton) {
        scrollToContentButton.addEventListener('click', function(event){
            event.preventDefault();

            window.Components.smoothScoll.scrollToElementById({elementId: 'content', gap: 10});
        });
    }
});

/**
 * Open the dialog as soon as the Component is ready
 */
document.addEventListener('Component.DialogWindow.Ready', function() {
    const alterEgoDialog = window.Components.dialogWindow.getDialogByName({name: 'alterego'});

    if (alterEgoDialog) {
        alterEgoDialog.open();
        window.Components.dataStorage.set({key: 'alterego', value: 'On', session: true})
    }
});

/**
 * Fetches all the dialog HTML data.
 *
 * @return {[]}
 */
function fetchDialogs()
{
    let promises = [];

    const utility = window.Components.utility;
    const dataStorage = window.Components.dataStorage;

    const dialogDisplayOnceForSession = [
        'alterego'
    ];

    const wrapperId = 'dialogWrapper_'+Math.ceil(Math.random()*1000000000);
    let dialogWrapper = document.getElementById(wrapperId);

    if (!dialogWrapper) {
        dialogWrapper = document.createElement('div');
        dialogWrapper.setAttribute('id', wrapperId);
        document.body.appendChild(dialogWrapper);
    }

    for (let i = 0, num = dialogDisplayOnceForSession.length; i < num; i++) {
        if (dataStorage.get({key: dialogDisplayOnceForSession[i]}) !== 'On') {
            promises.push(utility.fetch({
                url: '/dialogs/'+dialogDisplayOnceForSession[i]+'.html',
                method: 'GET',
                enctype: 'text/html',
                successCallback: function (response) {
                    return response.text().then(function (data) {

                        dialogWrapper.innerHTML += data;

                        return new Promise((resolve, reject) => {
                            resolve('done');
                        });
                    });
                }
            }));
        }
    }

    return promises;
}
