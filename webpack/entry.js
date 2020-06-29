require('./components/Utility');
require('./components/SmoothScroll');
require('./components/DataStorage');
require('./components/CookieStorage');
require('./components/FeatureToggleSwitch');
require('./components/LazyLoadImage');
require('./components/DialogWindow');

window['Components'] = {};

document.addEventListener('DOMContentLoaded', function () {
    const utility = new Utility({verbose: true});
    const smoothScroll = new SmoothScroll({utility: utility, verbose: true});
    let dataStorage;

    window.Components.utility = utility;
    window.Components.smoothScoll = smoothScroll
    window.Components.lazyLoadImage = new LazyLoadImage({utility: utility, verbose: true});

    try {
        dataStorage = new DataStorage({utility: utility, verbose: true});
    } catch (e) {
        dataStorage = new CookieStorage({utility: utility, verbose: true});
    }

    window.Components.dataStorage = dataStorage;

    // Handle dialogs after fetch them
    Promise.allSettled(fetchDialogs()).then(function(response) {
        window.Components.dialogWindow = new DialogWindow({utility: utility, verbose: true});
    });

    const scrollToContentButton = document.querySelector('.m-menu__link.-downarrow');

    // Smooth scroll handler
    if (scrollToContentButton) {
        scrollToContentButton.addEventListener('click', function(event){
            event.preventDefault();

            smoothScroll.scrollToElementById({elementId: 'content', gap: 10});
        });
    }
});

/**
 * Open the dialog as soon as the Component is ready
 */
document.addEventListener('Component.DialogWindow.Ready', function(){
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

    for (let i = 0, num = dialogDisplayOnceForSession.length; i < num; i++) {
        if (dataStorage.get({key: dialogDisplayOnceForSession[i]}) !== 'On') {
            promises.push(utility.fetch({
                url: '/dialogs/'+dialogDisplayOnceForSession[i]+'.html',
                method: 'GET',
                enctype: 'text/html',
                successCallback: function (response) {
                    return response.text().then(function (data) {
                        const div = document.createElement('div');
                        div.setAttribute('class', 'dialog')
                        div.setAttribute('id', 'dialog-'+dialogDisplayOnceForSession[i])
                        div.setAttribute('data-name', dialogDisplayOnceForSession[i])
                        div.innerHTML = data;
                        document.body.appendChild(div);

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
