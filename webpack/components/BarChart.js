/**
 * BarChart component.
 * @param {object} utility
 * @param {boolean} verbose
 * @returns {*}
 */
const BarChart = function ({utility, verbose = false})
{
    /** @type {NodeList} */
    let chartWrappers;
    /** @type {number} */
    let idCounter = 1;
    /** @type {string} */
    const consoleColorId = '#b47ee8';
    /** @type {number} */
    const currentYear = (new Date()).getFullYear();
    /** @type {number} */
    const currentQuarter = Math.ceil(((new Date()).getMonth() + 1) / 4);

    if (!utility instanceof Utility) {
        throw new ReferenceError('This component requires the Utility component to be loaded.');
    }

    /** @type {object} */
    const chartStyles = utility.readStylesheetsByClassName({className: 'chartComponent'});

    if (!chartStyles['.chartComponent .grid']) {
        throw new Error('Cannot read CSS data for Bar Chart');
    }

    /**
     * Counts the offset from the date info
     *
     * @param {string} dateInfo
     * @param {number} rangeFrom
     * @returns {number}
     */
    function getOffset(dateInfo, rangeFrom)
    {
        let startOffset = chartStyles['.chartComponent .grid'].paddingBottom;

        if (startOffset.indexOf('px') !== -1)
            startOffset = parseInt(startOffset.replace(/px/, ''));
        else {
            startOffset = parseInt((parseFloat(startOffset.replace(/rem/, '')) * 10.0) + '');
        }

        let rowHeight = chartStyles['.chartComponent .gridRow'].height;

        if (rowHeight.indexOf('px') !== -1)
            rowHeight = parseInt(rowHeight.replace(/px/, ''));
        else {
            rowHeight = parseInt((parseFloat(rowHeight.replace(/rem/, '')) * 10.0) + '');
        }

        if (dateInfo === 'today') {
            dateInfo = currentYear+'/Q'+currentQuarter;
        }

        const yearQuarter = dateInfo.split('/Q');
        const year = parseInt(yearQuarter[0]);
        const quarter = parseInt(yearQuarter[1]);
        // * 1 full year = 4 quarters, so the number of full years ((year - rangeFrom) * 4)
        // * new year = the 4th quarter finished, so it's already counted in full years, so a not full year (quarter - 1)
        // * The sum of full years and remaining quarters give the height of the bar: multiply with the height
        //   of a grid row and adds the bottom position
        return ((((year - rangeFrom) * 4) + (quarter - 1)) * rowHeight) + startOffset;
    }

    /**
     * A Bar Chart Element.
     *
     * @param {HTMLDivElement|Node} HTMLElement
     * @return {*}
     */
    const BarChartElement = function (HTMLElement)
    {
        const chartDataset = HTMLElement.querySelector('dl.chart-dataset');
        const rangeFrom = parseInt(chartDataset.dataset.rangefrom);
        const rangeTo = (new Date()).getFullYear()+1;
        const labels = chartDataset.querySelectorAll('dt');
        const bars = chartDataset.querySelectorAll('dd');

        let grid = '';
        let label = '';
        let style = '';

        for (let i = rangeTo; i >= rangeFrom; i--) {
            for (let j = 4; j > 0; j--) {
                label = j === 1 ? '<span>'+i+'</span>' : '';
                style = 'gridRow';

                if (j === 1) {
                    style += ' year';
                }

                if (j === currentQuarter && i === currentYear) {
                    style += ' thisQuarter';
                }

                grid += '<div class="'+style+'">'+label+'</div>';
            }
        }

        grid += '<div class="labels">';
        for (let index in labels) {
            if (labels.hasOwnProperty(index)) {
                let label = labels[index].innerText;
                grid += '<div>'+label+'</div>';
            }
        }
        grid += '</div>';

        for (let index in bars) {
            if (bars.hasOwnProperty(index)) {
                let bar = bars[index];
                let fromData = bar.dataset.from;
                let toData = bar.dataset.to;
                let skill = bar.dataset.skill;
                let counter = parseInt(index) + 1;

                let offsetBottom = getOffset(fromData, rangeFrom);
                let offsetTop = getOffset(toData, rangeFrom);

                grid += '<div class="skill '+skill+' col'+counter+'" style="bottom: '+offsetBottom+'px; height: '+(offsetTop-offsetBottom)+'px"></div>';
            }
        }

        HTMLElement.innerHTML = grid;

        verbose && console.info(
            '%c[Bar Chart]%c ✚%c a Bar Chart element initialized %o',
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
            '%c[Bar Chart]%c ...looking for Bar Chart elements.',
            'background:'+consoleColorId+';color:black;font-weight:bold;',
            'color:#599bd6;font-style:italic'
        );

        chartWrappers = document.querySelectorAll('.chartComponent .grid');

        chartWrappers.forEach(function (element) {
            if (typeof element.component === 'undefined') {
                /** @type {HTMLDivElement|Node} element */
                if (!element.hasAttribute('id')) {
                    element.setAttribute('id', 'barChart' + (idCounter++));
                }

                element.component = new BarChartElement(element);
            }
        });

        utility.triggerEvent({element: document, eventName: 'Component.BarChart.Ready', delay: 1});
    };

    verbose && console.info(
        '%c[Bar Chart]%c ✔%c The Bar Chart component loaded.',
        'background:'+consoleColorId+';color:black;font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:#599bd6; font-weight:bold;'
    );

    initialize();

    return {

    };
};

window['BarChart'] = BarChart;
