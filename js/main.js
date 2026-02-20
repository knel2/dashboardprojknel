mapboxgl.accessToken ='pk.eyJ1Ijoia25lbDIiLCJhIjoiY21rdTlkYmx5MThyZjNmcHVrMDYzdXJ4dyJ9.HrXpvWOlXxo7fGCGnGQG6A';

// declare the map object
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 7,
    minZoom: 5,
    center: [-120.7401, 47.7511]
});

const grades = [4,5,6],
colors = ['rgb(208,209,230)', 'rgb(103,169,207)', 'rgb(1,108,89)'],
radii = [5, 10, 20]

const legend = document.getElementById('legend');

let labels = ['<strong>Magnitude</strong>'],vbreak;

for(var i = 0; i < grades.length; i++) {
    console.log("hi")
    vbreak = grades[i];
    dot_radii = 2 * radii[i];
    labels.push(
        '<p class = "break"><i class = "dot" style = "background"' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' + dot_radii + 'px; "> <span class = "dot-label" style = "top: ' + dot_radii / 2 + 'px;"' + vbreak + '</span></p>');

    }

const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://earthquake.usgs.gov/earthquakes/">USGS</a></p>';

// join all the labels and the source to create the legend content.
legend.innerHTML = labels.join('') + source;


// async function geojsonFetch() {
//  console.log("hello")
//     let response;
//     response = await fetch('assets/DNR_Fire_Statistics_2008-Present.geojson');
//     fires = await response.json();

//     map.on('load', () => {

//         map.addSource('fires', {
//             type: 'geojson',
//             data: fires
//         })

//         console.log(fires.features[0].geometry.coordinates)
//         map.addLayer({
//             'id': 'fires-point',
//             'type': 'circle',
//             'source': 'fires',
//             'minzoom': 5,
//             'paint':{
//                 'circle-radius': {
//                     'property' : 'ACRES_BURNED',
//                     'stops':[
//                         [grades[0], colors[0]],
//                         [grades[1], colors[1]],
//                         [grades[2], colors[2]]
//                     ]
//                 },
//                 'circle-color': {
//                     'property' : 'ACRES_BURNED',
//                     'stops':[
//                         [grades[0], colors[0]],
//                         [grades[1], colors[1]],
//                         [grades[2], colors[2]]
//                     ]

//             },

//                 'circle-stroke-color' : 'white',
//                 'circle-stroke-width': 1,
//                 'circle-opacity': 0.6

//         }
//         },
//     'waterway-label'

// );

//     map.on('click', 'fires-point', (event) => {
//         new mapboxgl.Popup()
//             .setlngLat(event.features[0].geometry.coordinates)
//             console.log(features[0].geometry.coordinates)
//             .setHTML(`<strong>Magnitude:</strong> ${event.features[0].properties.mag}`)
//             .addTo(map)
//     });
//     }
// }
// geojsonFetch()

async function geojsonFetch() {

    // Await operator is used to wait for a promise.
    // An await can cause an async function to pause until a Promise is settled.
    let response;
    response = await fetch('assets/DNR_Fire_Statistics_2008-Present.geojson');
    fires = await response.json();



    //load data to the map as new layers.
    //map.on('load', function loadingData() {
    map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function

        // when loading a geojson, there are two steps
        // add a source of the data and then add the layer out of the source
        map.addSource('fires', {
            type: 'geojson',
            data: fires
        });


        map.addLayer({
                'id': 'fire-point',
                'type': 'circle',
                'source': 'fires',
                'minzoom': 5,
                'paint': {
                    // increase the radii of the circle as mag value increases
                    'circle-radius': {
                        'property': 'ACRES_BURNED',
                        'stops': [
                            [grades[0], radii[0]],
                            [grades[1], radii[1]],
                            [grades[2], radii[2]]
                        ]
                    },
                    // change the color of the circle as mag value increases
                    'circle-color': {
                        'property': 'ACRES_BURNED',
                        'stops': [
                            [grades[0], colors[0]],
                            [grades[1], colors[1]],
                            [grades[2], colors[2]]
                        ]
                    },
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    'circle-opacity': 0.6
                }
            },
            'waterway-label' // make the thematic layer above the waterway-label layer.
        );


        // click on each dot to view magnitude in a popup
        map.on('click', 'fires-point', (event) => {
            new mapboxgl.Popup()
                .setLngLat(event.features[0].geometry.coordinates)
                console.log(event.features[0].geometry.coordinates)
                .setHTML(`<strong>Magnitude:</strong> ${event.features[0].properties.ACRES_BURNED}`)
                .addTo(map);
        });



        // // the coordinated chart relevant operations

        // // found the the magnitudes of all the earthquakes in the displayed map view.
        // magnitudes = calEarthquakes(earthquakes, map.getBounds());

        // // enumerate the number of earthquakes.
        // numEarthquakes = magnitudes[4] + magnitudes[5] + magnitudes[6];

        // // update the content of the element earthquake-count.
        // document.getElementById("earthquake-count").innerHTML = numEarthquakes;

        // // add "mag" to the beginning of the x variable - the magnitude, and "#" to the beginning of the y variable - the number of earthquake of similar magnitude.
        // x = Object.keys(magnitudes);
        // x.unshift("mag")
        // y = Object.values(magnitudes);
        // y.unshift("#")


        // // generate the chart
        // earthquakeChart = c3.generate({
        //     size: {
        //         height: 350,
        //         width: 460
        //     },
        //     data: {
        //         x: 'mag',
        //         columns: [x, y],
        //         type: 'bar', // make a bar chart.
        //         colors: {
        //             '#': (d) => {
        //                 return colors[d["x"]];
        //             }
        //         },
        //         onclick: function (d) { // update the map and sidebar once the bar is clicked.
        //             let floor = parseInt(x[1 + d["x"]]),
        //                 ceiling = floor + 1;
        //             // combine two filters, the first is ['>=', 'mag', floor], the second is ['<', 'mag', ceiling]
        //             // the first indicates all the earthquakes with magnitude greater than floor, the second indicates
        //             // all the earthquakes with magnitude smaller than the ceiling.
        //             map.setFilter('earthquakes-point',
        //                 ['all',
        //                     ['>=', 'mag', floor],
        //                     ['<', 'mag', ceiling]
        //                 ]);
        //         }
        //     },
        //     axis: {
        //         x: { //magnitude
        //             type: 'category',
        //         },
        //         y: { //count
        //             tick: {
        //                 values: [10, 20, 30, 40]
        //             }
        //         }
        //     },
        //     legend: {
        //         show: false
        //     },
        //     bindto: "#earthquake-chart" //bind the chart to the place holder element "earthquake-chart".
        // });

    });



    // //load data to the map as new layers.
    // //map.on('load', function loadingData() {
    // map.on('idle', () => { //simplifying the function statement: arrow with brackets to define a function

    //     magnitudes = calEarthquakes(earthquakes, map.getBounds());
    //     numEarthquakes = magnitudes[4] + magnitudes[5] + magnitudes[6];
    //     document.getElementById("earthquake-count").innerHTML = numEarthquakes;


    //     x = Object.keys(magnitudes);
    //     x.unshift("mag")
    //     y = Object.values(magnitudes);
    //     y.unshift("#")

        // // after finishing each map reaction, the chart will be rendered in case the current bbox changes.
        // earthquakeChart.load({
        //     columns: [x, y]
        // });
    // });
}

// call the geojson loading function
geojsonFetch();