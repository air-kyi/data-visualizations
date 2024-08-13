//TODO
// explore map function
    // max and min area

// why is the page too wide????

// loading at start up

// edit basemap to take out stuff we dont want https://basemaps.cartocdn.com/gl/positron-gl-style/style.json

// hover options
// https://docs.mapbox.com/help/tutorials/create-interactive-hover-effects-with-mapbox-gl-js/

// ------------------ DATA ------------------
dataPath = 'data/with_era.geojson';
const config = JSON.parse(sessionStorage.getItem('config'));

// -------- CONSTANTS --------

const uChiLocation = [-87.59974479675293, 41.78955289156096];
const ChiLocation = [-87.63211524853163, 41.862161325588076];
const hydeParkLocation = [-87.59654429195592, 41.79504596867451];

const fullOpacity = 0.6;
const nav = new maplibregl.NavigationControl();

// -------- HELPER FUNCTIONS --------

function exploreMap() {
    const active = document.querySelector('#explore-button').dataset.active;
    console.log(active);

    if (active == 'Story') {
        // exploring map

        // change text and flag
        document.querySelector('#explore-button').dataset.active = 'Explore';
        document.querySelector('#explore-button').innerHTML = 'Return to Story';

        // disable scroll;
        document.body.classList.add('stop-scrolling');

        // hide scrollers
        document
            .querySelectorAll('.scroller')
            .forEach((o) => (o.style.visibility = 'hidden'));

        // allow map panning
        mapBody.dragPan.enable();
        mapBody.scrollZoom.enable();
        mapBody.boxZoom.enable();
        mapBody.doubleClickZoom.enable();
        mapBody.addControl(nav, 'top-right');
    } else {
        // change text and flag
        document.querySelector('#explore-button').dataset.active = 'Story';
        document.querySelector('#explore-button').innerHTML = 'Explore Map';

        // show scrollers
        console.log(document.querySelectorAll('.scroller'));
        document
            .querySelectorAll('.scroller')
            .forEach((o) => (o.style.visibility = 'visible'));

        // enable scroll
        document.body.classList.remove('stop-scrolling');

        // return to where we were
        //location = [center, zoom]
        mapBody.flyTo({
            center: uChiLocation,
            zoom: 15,
            duration: 2000
        });

        // disable map stuff
        mapBody.dragPan.disable();
        mapBody.scrollZoom.disable();
        mapBody.boxZoom.disable();
        mapBody.doubleClickZoom.disable();
        mapBody.removeControl(nav);
    }
}

function changeTimelineYear(targetYear) {
    pause = 25;

    let currentYearM3 = document.getElementById('timeline-3').innerHTML,
        currentYearM2 = document.getElementById('timeline-2').innerHTML,
        currentYearM1 = document.getElementById('timeline-1').innerHTML,
        currentYear = document.getElementById('timeline-0').innerHTML,
        currentYearP1 = document.getElementById('timeline+1').innerHTML,
        currentYearP2 = document.getElementById('timeline+2').innerHTML,
        currentYearP3 = document.getElementById('timeline+3').innerHTML;

    function incrementCounter() {
        document.getElementById('timeline-3').innerHTML = currentYearM3;
        document.getElementById('timeline-2').innerHTML = currentYearM2;
        document.getElementById('timeline-1').innerHTML = currentYearM1;
        document.getElementById('timeline-0').innerHTML = currentYear;
        document.getElementById('timeline+1').innerHTML = currentYearP1;
        document.getElementById('timeline+2').innerHTML = currentYearP2;
        document.getElementById('timeline+3').innerHTML = currentYearP3;

        if (targetYear > currentYear) {
            if (currentYear++ < targetYear) {
                currentYearM3++;
                currentYearM2++;
                currentYearM1++;
                currentYearP1++;
                currentYearP2++;
                currentYearP3++;
                setTimeout(incrementCounter, pause);
            }
        } else {
            if (currentYear-- > targetYear) {
                currentYearM3--;
                currentYearM2--;
                currentYearM1--;
                currentYearP1--;
                currentYearP2--;
                currentYearP3--;
                setTimeout(incrementCounter, pause);
            }
        }
    }
    incrementCounter();
}

// -------- MAP FUNCTIONS ---------

function createLayer(map_name, layerName, start_year = 1890, end_year = 2025) {
    /*
    create the base source and layers that we will filter
    */
    map_name.addLayer({
        id: layerName,
        type: 'fill',
        source: 'buildings',
        layout: {},
        paint: {
            'fill-color': '#800000',
            'fill-opacity': 0,
            'fill-opacity-transition': { duration: 1000 }
        },
        filter: [
            'all',
            ['>=', ['get', 'year_start'], start_year],
            ['<=', ['get', 'year_start'], end_year]
        ]
    });
}

function allLayers(map, type) {
    if (type == 'intro') {
        console.log('intro');
        createLayer(map, 'startLayer', 1890, 1900);
        createLayer(map, 'endLayer', 1890, 2025);
    } else if (type == 'body') {
        for (let year = 1900; year <= 2025; year += 25) {
            layerName = 'layer' + String(year);
            console.log(layerName);
            createLayer(map, layerName, 1890, year + 25);
        }
    }
}

function filterOpacity(map, layer, show = true) {
    if (show) {
        opacity = 0.6;
    } else {
        opacity = 0;
    }
    map.setPaintProperty(layer, 'fill-opacity', opacity);
}

function createMap(
    div,
    layers,
    startCoords = uChiLocation,
    zoomStart = 17,
    start_year = 1900
) {
    var map = new maplibregl.Map({
        container: div,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', // stylesheet locatio
        center: startCoords, // starting position [lng, lat]
        zoom: zoomStart, // starting zoom
        scrollZoom: false,
        boxZoom: false,
        doubleClickZoom: false,
        dragPan: false,
        pitchWithRotate: false,
        dragRotate: false,
        touchZoomRotate: false
        // TODO
        // maxBounds: bounds
    });
    map.on('load', () => {
        map.addSource('buildings', {
            type: 'geojson',
            data: dataPath
        });

        allLayers(map, layers);

        popupStuff(map);
    });

    return map;
}

function popupStuff(map) {
    // Create a popup, but don't add it to the map yet.

    // fix popup stuff, only on popup on turn on layer 
    // mapBody.getLayer('layer1900').paint._values['fill-opacity'].value.value

    const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mousemove', 'layerFill', (e) => {
        const active = document.querySelector('#explore-button').dataset.active;
        if (active == 'Explore') {
            // Change the cursor style as a UI indicator.
            map_name.getCanvas().style.cursor = 'pointer';
            // console.log(e.features[0].properties.name)
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description =
                e.features[0].properties.name +
                '<br>' +
                'Year Built: ' +
                e.features[0].properties.year_start;

            // if (['mercator', 'equirectangular'].includes(mapBody.getProjection().name)) {
            //     while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            //         coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            //     }
            // }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(e.lngLat).setHTML(description).addTo(map_name);
        }
    });

    map.on('mouseleave', 'layerFill', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
}

//  ------------ CONFIG TEXT ------------
// function to take config file and turn into html

function processConfig(config) {
    // config file is an  object with each chapter is an attribute
    for (const chapter of config) {
        //console.log(config[chapter])
        processChapter(chapter);
    }
}

function processChapter(chapter) {
    // a chapter is object with title:str and subsection:array of objects
    // create title div
    //console.log(chapter.title);
    let title_div = document.createElement('div');
    title_div.className = 'scroller chapter';
    title_div.id = 'chapter' + chapter.id;

    let title_text_div = document.createElement('div');
    title_text_div.innerHTML =
        '<p>Chapter ' +
        chapter.id +
        '</p>' +
        '<hr>' +
        '<p>' +
        chapter.chapterTitle +
        '</p>';
    title_text_div.className = 'chapter-title';

    let title_image_div = document.createElement('img');
    title_image_div.src = chapter.image;

    title_div.appendChild(title_text_div);
    title_div.appendChild(title_image_div);

    document.getElementById('chapters-container').appendChild(title_div);

    // create subsection divs
    for (const subsection of chapter.subsections) {
        //const subsection = chapter.subsections[subsection]
        let subsection_div = document.createElement('div');
        subsection_div.className = 'scroller';
        subsection_div.id = subsection.id;
        subsection_div.textContent = subsection.text;
        document
            .getElementById('chapters-container')
            .appendChild(subsection_div);
    }
}

// ------------ WAYPOINTS ------------

function updateLayers(addYear, removeLayer) {
    // update timeline
    changeTimelineYear((targetYear = addYear));

    // remove layer
    filterOpacity(mapBody, removeLayer, false);

    // add layer
    filterOpacity(mapBody, 'layer' + String(addYear), true);
}

function introWaypoints() {
    new Waypoint({
        element: document.getElementById('step1'),
        handler: function (direction) {
            if (direction == 'down') {
                console.log('waypoint1');
            } else {
                console.log('waypoint1 up');
                filterOpacity(mapIntro, 'endLayer', false);
                filterOpacity(mapIntro, 'startLayer', true);

                mapIntro.flyTo({
                    center: uChiLocation,
                    zoom: 15.5,
                    duration: 2000
                });
            }
        },
        offset: '1%'
    });

    new Waypoint({
        element: document.getElementById('step2'),
        handler: function () {
            console.log('waypoint2');
            filterOpacity(mapIntro, 'startLayer', false);

            filterOpacity(mapIntro, 'endLayer', true);

            mapIntro.flyTo({
                center: hydeParkLocation,
                zoom: 14,
                duration: 3500
            });
        },
        offset: '90%'
    });
}

function bodyWaypoints() {
    //   for (const chapter of config) {
    //     for (const subsection of chapter.subsections) {
    //     //console.log(config[chapter])
    //         new Waypoint({
    //         element: document.getElementById(subsection.id),
    //         handler: function (direction) {
    //             if (direction == "down") {

    //                 const data = dataAll.features.filter(d => d.properties.year_start >= subsection.start_year && d.properties.year_start <= subsection.end_year)
    //                 //bodyAllBuildings.clearLayers();
    //                 layers[subsection.id] = L.geoJSON(data, {style: buildingStyleShow}).addTo(mapBody);
    //                     mapBody.flyTo(uChiLocation, subsection.zoom, {
    //                         animate: true,
    //                         duration: 3
    //                         });
    //                 fadeInLayerLeaflet(layers[subsection.id], 0,.5, 0.005, 5)
    //             } else {
    //                 mapBody.removeLayer(layers[subsection.id])
    //             }},
    //         offset: offset,
    //     });
    //   }}
}

// create all waypoint triggers
function waypoints() {
    let offset = '50%';

    // intro way points
    introWaypoints();

    new Waypoint({
        element: document.getElementById('1.1'),
        handler: function (direction) {
            if (direction == 'down') {
                console.log('waypoint 1.1');
                document.getElementById('explore-nav').style.visibility =
                    'visible';
                filterOpacity(mapBody, 'layer1900');
                mapBody.flyTo({
                    center: uChiLocation,
                    zoom: 15.5,
                    duration: 6000
                });
            } else {
                document.getElementById('explore-nav').style.visibility =
                    'hidden';
            }
        },
        offset: '99%'
    });

    new Waypoint({
        element: document.getElementById('1.2'),
        handler: function (direction) {
            if (direction == 'down') {
                console.log('waypoint 1.2');

                updateLayers(1925, 'layer1900');
            } else {
                console.log('waypoint 1.2 up');
                updateLayers(1900, 'layer1925');
            }
        },
        offset: '99%'
    });
    new Waypoint({
        element: document.getElementById('2.1'),
        handler: function (direction) {
            if (direction == 'down') {
                console.log('waypoint 2.1');
                updateLayers(1950, 'layer1925');
                mapBody.flyTo({
                    center: hydeParkLocation,
                    zoom: 14,
                    duration: 3500
                });
            } else {
                console.log('waypoint 1.2 up');
                updateLayers(1925, 'layer1950');
                mapBody.flyTo({
                    center: uChiLocation,
                    zoom: 15.5,
                    duration: 6000
                });
            }
        },
        offset: '99%'
    });
}

// ------------ MAIN ------------
// combine all into one function
function main() {

    // create html elements from config
    processConfig(config);

    // create maps
    mapIntro = createMap('map-intro', 'intro', uChiLocation, 16);
    mapBody = createMap('map-body', 'body', ChiLocation, 12);
    popupStuff(mapBody);


    // figure out start loading
    mapIntro.on('style.load', () => {
        const waiting = () => {
            if (!mapIntro.isStyleLoaded()) {
                console.log('waiting');
                setTimeout(waiting, 200);
            } else {
                filterOpacity(mapIntro, 'startLayer', true);
            }
        };
        waiting();
    });

    // create waypoints
    waypoints();
}

// run everything
main();

// ------------ TESTING ------------

(function () {
    function setElementPosition(element, styles) {
        for (let key in styles) {
            element.style[key] = styles[key];
        }
    }

    function follow(event) {
        const { settings, element } = event.data;
        const elHeight = element.offsetHeight;
        const windowHeight = window.innerHeight;
        const screenTop = window.scrollY;
        const screenBottom = screenTop + windowHeight;
        const elTop = element.getBoundingClientRect().top + screenTop;
        const elBottom = elTop + elHeight;

        const isShorterThanScreen = elHeight < windowHeight;
        const isFollowTopPxVisible = screenTop <= settings.topPixel;
        const isFollowBottomPxVisible = screenBottom >= settings.bottomPixel;

        if (elHeight < settings.bottomPixel - settings.topPixel) {
            if (isShorterThanScreen) {
                if (isFollowTopPxVisible) {
                    setElementPosition(element, {
                        top: `${settings.topPixel - screenTop}px`,
                        bottom: ''
                    });
                } else if (
                    isFollowBottomPxVisible &&
                    settings.bottomPixel - screenTop < elHeight
                ) {
                    setElementPosition(element, {
                        top: '',
                        bottom: `${screenBottom - settings.bottomPixel}px`
                    });
                } else {
                    setElementPosition(element, { top: '0', bottom: '' });
                }
            } else {
                if (isFollowBottomPxVisible) {
                    setElementPosition(element, {
                        top: '',
                        bottom: `${screenBottom - settings.bottomPixel}px`
                    });
                } else if (isFollowTopPxVisible) {
                    setElementPosition(element, {
                        top: `${settings.topPixel - screenTop}px`,
                        bottom: ''
                    });
                } else {
                    const prevScreenTop = element.dataset.followScreen || 0;
                    const scrollDistance = screenTop - prevScreenTop;

                    if (scrollDistance < 0) {
                        if (Math.abs(scrollDistance) > screenTop - elTop) {
                            setElementPosition(element, {
                                top: '0',
                                bottom: ''
                            });
                        } else {
                            setElementPosition(element, {
                                top: `${
                                    element.getBoundingClientRect().top -
                                    (distance || 0)
                                }px`,
                                bottom: ''
                            });
                        }
                    } else {
                        if (
                            Math.abs(scrollDistance) >
                            elBottom - screenBottom
                        ) {
                            setElementPosition(element, {
                                top: '',
                                bottom: '0'
                            });
                        } else {
                            setElementPosition(element, {
                                top: `${
                                    element.getBoundingClientRect().top -
                                    (distance || 0)
                                }px`,
                                bottom: ''
                            });
                        }
                    }
                }
            }
        }

        element.dataset.followScreen = screenTop;
    }

    Element.prototype.followScreen = function (options) {
        const settings = Object.assign(
            { topPixel: 0, bottomPixel: Infinity },
            options
        );

        this.style.position = 'fixed';
        const data = { element: this, settings };

        const onScroll = () => follow({ data });
        window.addEventListener('scroll', onScroll);

        follow({ data });
    };

    document.addEventListener('DOMContentLoaded', () => {
        const topPxOfFooter = document
            .querySelector('#title-container')
            .getBoundingClientRect().top; //+ window.scrollY;

        document.querySelectorAll('#map-intro').forEach((element) => {
            element.followScreen({ topPixel: 0, bottomPixel: topPxOfFooter });
        });
    });
})();
