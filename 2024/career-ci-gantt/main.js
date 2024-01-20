// For API and chart documentation please look here:
// https://www.highcharts.com/demo
// THE CHART
Highcharts.ganttChart('container', {
    chart: {
        styledMode: true
    },
    title: {
        text: 'Highcharts Gantt in Styled Mode'
    },
    subtitle: {
        text: 'Purely CSS-driven design'
    },
    xAxis: {
        min: today.getTime() - (2 * day),
        max: today.getTime() + (21 * day)
    },
    accessibility: {
        keyboardNavigation: {
            seriesNavigation: {
                mode: 'serialize'
            }
        },
        point: {
            descriptionFormat: '{yCategory}. Start {x:%Y-%m-%d}, end {x2:%Y-%m-%d}.'
        }
    },
    lang: {
        accessibility: {
            axis: {
                xAxisDescriptionPlural: 'The chart has a two-part X axis showing time in both week numbers and days.'
            }
        }
    },
    series: [{
        name: 'Project 1',
        data: [{
            name: 'Journalism',
            id: 'journalism',
            start: today.getTime() + (2 * day),
            end: today.getTime() + (8 * day)
        }, {
            name: 'Arts',
            id: 'arts',
            start: today.getTime() + (3 * day),
            end: today.getTime() + (8 * day)
        }, {
            name: 'Journalism, Arts, and Media --> Media, Arts, and Design',
            id: 'jam',
            dependency: 'journalism',
            dependency: 'arts',
            start: today.getTime() + (8 * day),
            end: today.getTime() + (19 * day)
        }, {
            name: 'Business',
            id: 'business',
            start: today.getTime(),
            end: today.getTime() + (19 * day)
        }, {
            name: 'Law',
            parent: 'law',
            start: today.getTime() + (2 * day),
            end: today.getTime() + (19 * day)
        }, {
            name: 'Health Professions',
            id: 'health',
            start: today.getTime() + (2 * day),
            end: today.getTime() + (19 * day)
        }, {
            name: 'Public & Social Service --> Policy & Social Impact',
            id: 'unit_tests',
            start: today.getTime() + (5 * day),
            end: today.getTime() + (19 * day)
        }, {
            name: 'STEM',
            id: 'stem',
            start: today.getTime() + (5 * day),
            end: today.getTime() + (17 * day)
        }, {
            name: 'Computer Science',
            id: 'cs',
            parent: 'stem',
            dependency: 'stem',
            start: today.getTime() + (15 * day),
            end: today.getTime() + (19 * day)
        }, {
            name: 'Biological Sciences',
            id: 'bs',
            parent: 'stem',
            dependency: 'stem',
            start: today.getTime() + (16 * day),
            end: today.getTime() + (19 * day)
        }, {
            name: 'Engineering',
            id: 'engineering',
            parent: 'stem',
            dependency: 'stem',
            start: today.getTime() + (16 * day),
            end: today.getTime() + (19 * day)
        }, {
            name: 'Physical Sciences',
            id: 'ps',
            parent: 'stem',
            dependency: 'stem',
            start: today.getTime() + (17 * day),
            end: today.getTime() + (19 * day)
        }, {
            name: 'Education Professions',
            id: 'ep',
            start: today.getTime() + (7 * day),
            end: today.getTime() + (19 * day)
        }, {
            name: 'Entrepreneurship',
            id: 'entrepreneurship',
            start: today.getTime() + (7 * day),
            end: today.getTime() + (19 * day)
        }, {
            name: 'Behavioral Sciences',
            id: 'bes',
            start: today.getTime() + (15 * day),
            end: today.getTime() + (19 * day)
        }, {
            name: 'Climate & Energy',
            id: 'ce',
            start: today.getTime() + (15 * day),
            end: today.getTime() + (19 * day)
        }, {
            name: 'Game Design',
            id: 'gd',
            start: today.getTime() + (18 * day),
            end: today.getTime() + (19 * day)
        }]
    }]
});